// Step 1 — imports

import { useState } from "react";
import api from "../../../../api/axios";
import '../Styles/AddAmenity.css';


const AddAmenity = () => {

    // Step 2 — state

    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions

    const createAmenity = async () => {

        const response = await api.post("/hotel/amenities", {
            category,
            name,
            description: description || null,
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

            const data = await createAmenity();

            setMessage(
                data.message || "Amenity created successfully."
            );

            setCategory("");
            setName("");
            setDescription("");
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
        <div className="aa-container">

            <div className="aa-header">

                <h1 className="aa-title">
                    Add Amenity
                </h1>

                <p className="aa-subtitle">
                    Add a new amenity.
                </p>

            </div>


            <form
                className="aa-form"
                onSubmit={handleSubmit}
            >

                <div className="aa-field">

                    <label
                        className="aa-label"
                        htmlFor="aa-category"
                    >
                        Category
                    </label>

                    <input
                        id="aa-category"
                        type="text"
                        className="aa-input"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        placeholder="e.g. Wellness"
                        maxLength={100}
                        required
                    />

                </div>


                <div className="aa-field">

                    <label
                        className="aa-label"
                        htmlFor="aa-name"
                    >
                        Amenity Name
                    </label>

                    <input
                        id="aa-name"
                        type="text"
                        className="aa-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Finnish Sauna"
                        maxLength={150}
                        required
                    />

                </div>


                <div className="aa-field">

                    <label
                        className="aa-label"
                        htmlFor="aa-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="aa-description"
                        className="aa-textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the amenity"
                    />

                </div>


                <div className="aa-field">

                    <label
                        className="aa-label"
                        htmlFor="aa-status"
                    >
                        Status
                    </label>

                    <select
                        id="aa-status"
                        className="aa-select"
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
                    <div className="aa-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="aa-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="aa-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Amenity"}
                </button>

            </form>

        </div>
    );
};


export default AddAmenity;