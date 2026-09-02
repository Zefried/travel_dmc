// Step 1 — imports

import { useState } from "react";
import api from "../../../../api/axios";
import '../Styles/AddBedConfigForm.css';


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


type AddBedConfigFormProps = {
    selectedRoomType: RoomType;
};


const AddBedConfigForm = ({
    selectedRoomType,
}: AddBedConfigFormProps) => {

    // Step 2 — state

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [extraPrice, setExtraPrice] = useState("");
    const [status, setStatus] = useState("active");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions


    // Step 4 — handlers

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/hotel/room-configurations",
                {
                    room_type_id: selectedRoomType.id,
                    type: "bed",
                    name,
                    meal_code: null,
                    description: description || null,
                    extra_price: extraPrice
                        ? Number(extraPrice)
                        : null,
                    status,
                }
            );


            setMessage(
                response.data?.message ||
                "Bed configuration created successfully."
            );


            setName("");
            setDescription("");
            setExtraPrice("");
            setStatus("active");

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to create bed configuration."
            );

        } finally {

            setLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="abc-container">

            <div className="abc-header">

                <h2 className="abc-title">
                    Add Bed Configuration
                </h2>

                <p className="abc-subtitle">
                    Add a bed configuration for the selected room type.
                </p>

            </div>


            <div className="abc-room-type">

                <strong>
                    Room Type:
                </strong>

                <span>
                    {selectedRoomType.name}
                </span>

                <span>
                    {selectedRoomType.bedroom} BHK
                </span>

              

            </div>


            <form
                className="abc-form"
                onSubmit={handleSubmit}
            >

                <div className="abc-field">

                    <label
                        className="abc-label"
                        htmlFor="abc-name"
                    >
                        Configuration Name
                    </label>

                    <input
                        id="abc-name"
                        type="text"
                        className="abc-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. 2 King Beds"
                        maxLength={150}
                        required
                    />

                </div>


                <div className="abc-field">

                    <label
                        className="abc-label"
                        htmlFor="abc-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="abc-description"
                        className="abc-textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the bed configuration"
                    />

                </div>


                <div className="abc-field">

                    <label
                        className="abc-label"
                        htmlFor="abc-extra-price"
                    >
                        Extra Price
                    </label>

                    <input
                        id="abc-extra-price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="abc-input"
                        value={extraPrice}
                        onChange={(e) =>
                            setExtraPrice(e.target.value)
                        }
                        placeholder="e.g. 500"
                    />

                </div>


                <div className="abc-field">

                    <label
                        className="abc-label"
                        htmlFor="abc-status"
                    >
                        Status
                    </label>

                    <select
                        id="abc-status"
                        className="abc-select"
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

                    </select>

                </div>


                {message && (
                    <div className="abc-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="abc-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="abc-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Bed Configuration"}
                </button>

            </form>

        </div>
    );
};


export default AddBedConfigForm;