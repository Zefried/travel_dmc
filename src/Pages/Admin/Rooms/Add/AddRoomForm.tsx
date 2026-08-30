// Step 1 — imports

import { useState } from "react";
import api from "../../../../api/axios";


type RoomType = {
    id: number;
    name: string;
    type: string;
    bedroom: number;
    property: {
        id: number;
        name: string;
        country: {
            id: number;
            name: string;
        };
        city: {
            id: number;
            name: string;
        };
    };
};


type AddRoomFormProps = {
    selectedRoomType: RoomType;
};


const AddRoomForm = ({
    selectedRoomType,
}: AddRoomFormProps) => {

    // Step 2 — state

    const [roomNo, setRoomNo] = useState("");
    const [status, setStatus] = useState("active");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions

    const createRoom = async () => {

        const response = await api.post("/admin/rooms", {
            room_type_id: selectedRoomType.id,
            room_no: roomNo,
            status,
        });

        return response.data;
    };


    // Step 4 — handlers

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const data = await createRoom();

            setMessage(
                data.message ||
                "Room created successfully."
            );

            setRoomNo("");
            setStatus("active");

        } catch (error: any) {

            const responseData = error?.response?.data;

            if (responseData?.errors) {

                const firstError = Object.values(
                    responseData.errors
                )
                    .flat()
                    .find(Boolean);

                setError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="arrf-container">

            <div className="arrf-header">

                <h2 className="arrf-title">
                    Add Room
                </h2>

                <p className="arrf-subtitle">
                    Add a physical room to the selected room type.
                </p>

            </div>


            <div className="arrf-selected-room-type">

                <strong>
                    Room Type:
                </strong>

                <span>
                    {selectedRoomType.name}
                </span>

                <span>
                    {selectedRoomType.bedroom} BHK
                </span>

                <span>
                    Property: {selectedRoomType.property.name}
                </span>

                <span>
                    {selectedRoomType.property.country.name},{" "}
                    {selectedRoomType.property.city.name}
                </span>

            </div>


            <form
                className="arrf-form"
                onSubmit={handleSubmit}
            >

                <div className="arrf-field">

                    <label
                        className="arrf-label"
                        htmlFor="arrf-room-no"
                    >
                        Room Number
                    </label>

                    <input
                        id="arrf-room-no"
                        type="text"
                        className="arrf-input"
                        value={roomNo}
                        onChange={(e) =>
                            setRoomNo(e.target.value)
                        }
                        placeholder="e.g. A101"
                        maxLength={100}
                        required
                    />

                </div>


                <div className="arrf-field">

                    <label
                        className="arrf-label"
                        htmlFor="arrf-status"
                    >
                        Status
                    </label>

                    <select
                        id="arrf-status"
                        className="arrf-select"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="maintenance">
                            Maintenance
                        </option>

                    </select>

                </div>


                {message && (
                    <div className="arrf-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="arrf-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="arrf-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Room"}
                </button>

            </form>

        </div>
    );
};


export default AddRoomForm;