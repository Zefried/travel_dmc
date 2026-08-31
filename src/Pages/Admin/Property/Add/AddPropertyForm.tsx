// Step 1 — imports

import React, { useState } from "react";
import api from "../../../../api/axios";
import '../Styles/AddPropertyForm.css';

type HotelAdmin = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
};


type PropertyLocation = {
    countryId: string;
    stateId: string;
    cityId: string;
};


type AddPropertyFormProps = {
    selectedHotelAdmin: HotelAdmin;
    selectedLocation: PropertyLocation;
};


const AddPropertyForm = ({
    selectedHotelAdmin,
    selectedLocation,
}: AddPropertyFormProps) => {

    // Step 2 — state

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [starRating, setStarRating] = useState("");

    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [phone, setPhone] = useState("");
    const [alternativePhone, setAlternativePhone] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");

    const [status, setStatus] = useState("active");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions

    const createProperty = async () => {

        const response = await api.post("/hotel/properties", {

            hotel_admin_id: selectedHotelAdmin.id,

            name,
            type,
            star_rating: starRating || null,

            description: description || null,

            country_id: selectedLocation.countryId,
            state_id: selectedLocation.stateId || null,
            city_id: selectedLocation.cityId,

            address: address || null,
            postal_code: postalCode,

            latitude: latitude || null,
            longitude: longitude || null,

            phone,
            alternative_phone: alternativePhone || null,
            email: email || null,
            website: website || null,

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

            const data = await createProperty();

            setMessage(
                data.message ||
                "Property created successfully."
            );


            setName("");
            setType("");
            setStarRating("");
            setDescription("");
            setAddress("");
            setPostalCode("");
            setLatitude("");
            setLongitude("");
            setPhone("");
            setAlternativePhone("");
            setEmail("");
            setWebsite("");
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
        <div className="adpf-container">

            <div className="adpf-header">

                <h2 className="adpf-title">
                    Add Property
                </h2>

                <p className="adpf-subtitle">
                    Add property details.
                </p>

            </div>


            <div className="adpf-selected-admin">

                <strong>
                    Hotel Admin:
                </strong>

                <span>
                    {selectedHotelAdmin.name}
                </span>

            </div>


            <form
                className="adpf-form"
                onSubmit={handleSubmit}
            >

                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-name"
                    >
                        Property Name
                    </label>

                    <input
                        id="adpf-name"
                        type="text"
                        className="adpf-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="e.g. Avani Sukhumvit Bangkok"
                        required
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-type"
                    >
                        Property Type
                    </label>

                    <input
                        id="adpf-type"
                        type="text"
                        className="adpf-input"
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                        placeholder="e.g. Hotel"
                        required
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-star-rating"
                    >
                        Star Rating
                    </label>

                    <select
                        id="adpf-star-rating"
                        className="adpf-select"
                        value={starRating}
                        onChange={(e) =>
                            setStarRating(e.target.value)
                        }
                    >
                        <option value="">
                            Select Rating
                        </option>

                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="adpf-description"
                        className="adpf-textarea"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the property"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-address"
                    >
                        Address
                    </label>

                    <textarea
                        id="adpf-address"
                        className="adpf-textarea"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        placeholder="Property address"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-postal-code"
                    >
                        Postal Code
                    </label>

                    <input
                        id="adpf-postal-code"
                        type="text"
                        className="adpf-input"
                        value={postalCode}
                        onChange={(e) =>
                            setPostalCode(e.target.value)
                        }
                        placeholder="e.g. 10260"
                        required
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-latitude"
                    >
                        Latitude
                    </label>

                    <input
                        id="adpf-latitude"
                        type="number"
                        step="any"
                        className="adpf-input"
                        value={latitude}
                        onChange={(e) =>
                            setLatitude(e.target.value)
                        }
                        placeholder="e.g. 13.6907"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-longitude"
                    >
                        Longitude
                    </label>

                    <input
                        id="adpf-longitude"
                        type="number"
                        step="any"
                        className="adpf-input"
                        value={longitude}
                        onChange={(e) =>
                            setLongitude(e.target.value)
                        }
                        placeholder="e.g. 100.6125"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-phone"
                    >
                        Phone
                    </label>

                    <input
                        id="adpf-phone"
                        type="text"
                        className="adpf-input"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        placeholder="Property phone number"
                        required
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-alternative-phone"
                    >
                        Alternative Phone
                    </label>

                    <input
                        id="adpf-alternative-phone"
                        type="text"
                        className="adpf-input"
                        value={alternativePhone}
                        onChange={(e) =>
                            setAlternativePhone(e.target.value)
                        }
                        placeholder="Alternative phone number"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-email"
                    >
                        Email
                    </label>

                    <input
                        id="adpf-email"
                        type="email"
                        className="adpf-input"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="reservations@example.com"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-website"
                    >
                        Website
                    </label>

                    <input
                        id="adpf-website"
                        type="url"
                        className="adpf-input"
                        value={website}
                        onChange={(e) =>
                            setWebsite(e.target.value)
                        }
                        placeholder="example.com"
                    />

                </div>


                <div className="adpf-field">

                    <label
                        className="adpf-label"
                        htmlFor="adpf-status"
                    >
                        Status
                    </label>

                    <select
                        id="adpf-status"
                        className="adpf-select"
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
                    <div className="adpf-success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="adpf-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="adpf-submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Property"}
                </button>

            </form>

        </div>
    );
};


export default AddPropertyForm;