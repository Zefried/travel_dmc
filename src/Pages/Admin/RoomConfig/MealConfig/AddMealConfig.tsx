// Step 1 — imports

import { useState } from "react";
import api from "../../../../api/axios";
import '../Styles/AddMealConfigForm.css';


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


type AddMealConfigFormProps = {
    selectedRoomType: RoomType;
};


const AddMealConfigForm = ({
    selectedRoomType,
}: AddMealConfigFormProps) => {

    // Step 2 — state

    const [name, setName] = useState("");
    const [mealCode, setMealCode] = useState("RO");
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
                    type: "meal",
                    name,
                    meal_code: mealCode,
                    description: description || null,
                    extra_price: extraPrice
                        ? Number(extraPrice)
                        : null,
                    status,
                }
            );

            setMessage(
                response.data?.message ||
                "Meal configuration created successfully."
            );

            setName("");
            setMealCode("RO");
            setDescription("");
            setExtraPrice("");
            setStatus("active");

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to create meal configuration."
            );

        } finally {

            setLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="amc-container">

            <div className="amc-header">

                <h2 className="amc-title">
                    Add Meal Configuration
                </h2>

                <p className="amc-subtitle">
                    Add a meal configuration for the selected room type.
                </p>

            </div>


            <div className="amc-room-type">

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
                className="amc-form"
                onSubmit={handleSubmit}
            >

                <div className="amc-field">

                    <label
                        className="amc-label"
                        htmlFor="amc-name"
                    >
                        Configuration Name
                    </label>

                    <input
                        id="amc-name"
                        type="text"
                        className="amc-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Breakfast Plan"
                        maxLength={150}
                        required
                    />

                </div>


                <div className="amc-field">

                    <label
                        className="amc-label"
                        htmlFor="amc-meal-code"
                    >
                        Meal Plan
                    </label>

                    <select
                        id="amc-meal-code"
                        className="amc-select"
                        value={mealCode}
                        onChange={(e) =>
                            setMealCode(e.target.value)
                        }
                    >

                        <option value="RO">
                            Room Only
                        </option>

                        <option value="HB">
                            Half Board
                        </option>

                        <option value="FB">
                            Full Board
                        </option>

                        <option value="AI">
                            All Inclusive
                        </option>

                    </select>

                </div>


                <div className="amc-field">

                    <label
                        className="amc-label"
                        htmlFor="amc-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="amc-description"
                        className="amc-textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the meal configuration"
                    />

                </div>


                <div className="amc-field">

                    <label
                        className="amc-label"
                        htmlFor="amc-extra-price"
                    >
                        Extra Price
                    </label>

                    <input
                        id="amc-extra-price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="amc-input"
                        value={extraPrice}
                        onChange={(e) =>
                            setExtraPrice(e.target.value)
                        }
                        placeholder="e.g. 500"
                    />

                </div>


                <div className="amc-field">

                    <label
                        className="amc-label"
                        htmlFor="amc-status"
                    >
                        Status
                    </label>

                    <select
                        id="amc-status"
                        className="amc-select"
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
                    <div className="amc-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="amc-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="amc-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Meal Configuration"}
                </button>

            </form>

        </div>
    );
};


export default AddMealConfigForm;