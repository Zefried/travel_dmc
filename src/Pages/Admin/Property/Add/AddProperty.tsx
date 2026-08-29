// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";


const AddProperty = () => {

    // Step 2 — state

    const [adpCountries, setAdpCountries] = useState<any[]>([]);
    const [adpStates, setAdpStates] = useState<any[]>([]);
    const [adpCities, setAdpCities] = useState<any[]>([]);

    const [adpCountryId, setAdpCountryId] = useState("");
    const [adpStateId, setAdpStateId] = useState("");
    const [adpCityId, setAdpCityId] = useState("");

    const [adpName, setAdpName] = useState("");
    const [adpType, setAdpType] = useState("");
    const [adpStarRating, setAdpStarRating] = useState("");

    const [adpDescription, setAdpDescription] = useState("");
    const [adpAddress, setAdpAddress] = useState("");
    const [adpPostalCode, setAdpPostalCode] = useState("");

    const [adpLatitude, setAdpLatitude] = useState("");
    const [adpLongitude, setAdpLongitude] = useState("");

    const [adpPhone, setAdpPhone] = useState("");
    const [adpAlternativePhone, setAdpAlternativePhone] = useState("");
    const [adpEmail, setAdpEmail] = useState("");
    const [adpWebsite, setAdpWebsite] = useState("");

    const [adpStatus, setAdpStatus] = useState("active");

    const [adpLoading, setAdpLoading] = useState(false);
    const [adpMessage, setAdpMessage] = useState("");
    const [adpError, setAdpError] = useState("");


    // Step 3 — functions

    const adpFetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setAdpCountries(response.data.data.data);
    };


    const adpFetchStates = async (countryId: string) => {

        const response = await api.get(
            `/admin/states?country_id=${countryId}`
        );

        setAdpStates(response.data.data.data);
    };


    const adpFetchCities = async (stateId: string) => {

        const response = await api.get(
            `/admin/cities?state_id=${stateId}`
        );

        setAdpCities(response.data.data.data);
    };


    const adpCreateProperty = async () => {

        const response = await api.post("/admin/properties", {

            name: adpName,
            type: adpType,
            star_rating: adpStarRating,

            description: adpDescription,

            country_id: adpCountryId,
            state_id: adpStateId || null,
            city_id: adpCityId,

            address: adpAddress,
            postal_code: adpPostalCode,

            latitude: adpLatitude || null,
            longitude: adpLongitude || null,

            phone: adpPhone,
            alternative_phone: adpAlternativePhone || null,
            email: adpEmail || null,
            website: adpWebsite || null,

            status: adpStatus,
        });

        return response.data;
    };


    useEffect(() => {

        const adpLoadCountries = async () => {

            try {

                await adpFetchCountries();

            } catch (error: any) {

                setAdpError(
                    error?.response?.data?.message ||
                    "Failed to load countries."
                );
            }
        };

        adpLoadCountries();

    }, []);


    // Step 4 — handlers

    const adpHandleCountryChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const countryId = e.target.value;

        setAdpCountryId(countryId);

        setAdpStateId("");
        setAdpCityId("");

        setAdpStates([]);
        setAdpCities([]);

        setAdpError("");

        if (!countryId) {
            return;
        }

        try {

            await adpFetchStates(countryId);

        } catch (error: any) {

            setAdpError(
                error?.response?.data?.message ||
                "Failed to load states."
            );
        }
    };


    const adpHandleStateChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const stateId = e.target.value;

        setAdpStateId(stateId);
        setAdpCityId("");

        setAdpCities([]);
        setAdpError("");

        if (!stateId) {
            return;
        }

        try {

            await adpFetchCities(stateId);

        } catch (error: any) {

            setAdpError(
                error?.response?.data?.message ||
                "Failed to load cities."
            );
        }
    };


    const adpHandleCityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setAdpCityId(e.target.value);
    };


    const adpHandleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setAdpLoading(true);
        setAdpMessage("");
        setAdpError("");

        try {

            const data = await adpCreateProperty();

            setAdpMessage(
                data.message ||
                "Property created successfully."
            );

        } catch (error: any) {

            const responseData = error?.response?.data;

            if (responseData?.errors) {

                const firstError = Object.values(
                    responseData.errors
                )
                    .flat()
                    .find(Boolean);

                setAdpError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setAdpError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setAdpLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="adp-container">

            <div className="adp-header">

                <h1 className="adp-title">
                    Add Property
                </h1>

                <p className="adp-subtitle">
                    Add a new property.
                </p>

            </div>


            <form
                className="adp-form"
                onSubmit={adpHandleSubmit}
            >

                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-name"
                    >
                        Property Name
                    </label>

                    <input
                        id="adp-name"
                        type="text"
                        className="adp-input"
                        value={adpName}
                        onChange={(e) =>
                            setAdpName(e.target.value)
                        }
                        placeholder="e.g. Avani Sukhumvit Bangkok"
                        required
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-type"
                    >
                        Property Type
                    </label>

                    <input
                        id="adp-type"
                        type="text"
                        className="adp-input"
                        value={adpType}
                        onChange={(e) =>
                            setAdpType(e.target.value)
                        }
                        placeholder="e.g. Hotel"
                        required
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-star-rating"
                    >
                        Star Rating
                    </label>

                    <select
                        id="adp-star-rating"
                        className="adp-select"
                        value={adpStarRating}
                        onChange={(e) =>
                            setAdpStarRating(e.target.value)
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


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-country"
                    >
                        Country
                    </label>

                    <select
                        id="adp-country"
                        className="adp-select"
                        value={adpCountryId}
                        onChange={adpHandleCountryChange}
                        required
                    >

                        <option value="">
                            Select Country
                        </option>

                        {adpCountries.map((country) => (
                            <option
                                key={country.id}
                                value={country.id}
                            >
                                {country.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-state"
                    >
                        State
                    </label>

                    <select
                        id="adp-state"
                        className="adp-select"
                        value={adpStateId}
                        onChange={adpHandleStateChange}
                        disabled={!adpCountryId}
                    >

                        <option value="">
                            Select State
                        </option>

                        {adpStates.map((state) => (
                            <option
                                key={state.id}
                                value={state.id}
                            >
                                {state.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-city"
                    >
                        City
                    </label>

                    <select
                        id="adp-city"
                        className="adp-select"
                        value={adpCityId}
                        onChange={adpHandleCityChange}
                        disabled={!adpStateId}
                        required
                    >

                        <option value="">
                            Select City
                        </option>

                        {adpCities.map((city) => (
                            <option
                                key={city.id}
                                value={city.id}
                            >
                                {city.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-description"
                    >
                        Description
                    </label>

                    <textarea
                        id="adp-description"
                        className="adp-textarea"
                        value={adpDescription}
                        onChange={(e) =>
                            setAdpDescription(e.target.value)
                        }
                        placeholder="Describe the property"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-address"
                    >
                        Address
                    </label>

                    <textarea
                        id="adp-address"
                        className="adp-textarea"
                        value={adpAddress}
                        onChange={(e) =>
                            setAdpAddress(e.target.value)
                        }
                        placeholder="Property address"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-postal-code"
                    >
                        Postal Code
                    </label>

                    <input
                        id="adp-postal-code"
                        type="text"
                        className="adp-input"
                        value={adpPostalCode}
                        onChange={(e) =>
                            setAdpPostalCode(e.target.value)
                        }
                        placeholder="e.g. 10260"
                        required
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-latitude"
                    >
                        Latitude
                    </label>

                    <input
                        id="adp-latitude"
                        type="number"
                        step="any"
                        className="adp-input"
                        value={adpLatitude}
                        onChange={(e) =>
                            setAdpLatitude(e.target.value)
                        }
                        placeholder="e.g. 13.6907"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-longitude"
                    >
                        Longitude
                    </label>

                    <input
                        id="adp-longitude"
                        type="number"
                        step="any"
                        className="adp-input"
                        value={adpLongitude}
                        onChange={(e) =>
                            setAdpLongitude(e.target.value)
                        }
                        placeholder="e.g. 100.6125"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-phone"
                    >
                        Phone
                    </label>

                    <input
                        id="adp-phone"
                        type="text"
                        className="adp-input"
                        value={adpPhone}
                        onChange={(e) =>
                            setAdpPhone(e.target.value)
                        }
                        placeholder="Property phone number"
                        required
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-alternative-phone"
                    >
                        Alternative Phone
                    </label>

                    <input
                        id="adp-alternative-phone"
                        type="text"
                        className="adp-input"
                        value={adpAlternativePhone}
                        onChange={(e) =>
                            setAdpAlternativePhone(e.target.value)
                        }
                        placeholder="Alternative phone number"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-email"
                    >
                        Email
                    </label>

                    <input
                        id="adp-email"
                        type="email"
                        className="adp-input"
                        value={adpEmail}
                        onChange={(e) =>
                            setAdpEmail(e.target.value)
                        }
                        placeholder="reservations@example.com"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-website"
                    >
                        Website
                    </label>

                    <input
                        id="adp-website"
                        type="url"
                        className="adp-input"
                        value={adpWebsite}
                        onChange={(e) =>
                            setAdpWebsite(e.target.value)
                        }
                        placeholder="https://example.com"
                    />

                </div>


                <div className="adp-field">

                    <label
                        className="adp-label"
                        htmlFor="adp-status"
                    >
                        Status
                    </label>

                    <select
                        id="adp-status"
                        className="adp-select"
                        value={adpStatus}
                        onChange={(e) =>
                            setAdpStatus(e.target.value)
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


                {adpMessage && (
                    <div className="adp-success">
                        {adpMessage}
                    </div>
                )}


                {adpError && (
                    <div className="adp-error">
                        {adpError}
                    </div>
                )}


                <button
                    type="submit"
                    className="adp-submit"
                    disabled={adpLoading}
                >
                    {adpLoading
                        ? "Creating..."
                        : "Create Property"}
                </button>

            </form>

        </div>
    );
};


export default AddProperty;