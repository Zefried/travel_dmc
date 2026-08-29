// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../../api/axios";
// import "./AddState.css";


const AddState = () => {

    // Step 2 — state

    const [adsCountries, setAdsCountries] = useState<any[]>([]);
    const [adsCountryId, setAdsCountryId] = useState("");

    const [adsName, setAdsName] = useState("");
    const [adsCode, setAdsCode] = useState("");
    const [adsStatus, setAdsStatus] = useState("active");

    const [adsLoading, setAdsLoading] = useState(false);
    const [adsMessage, setAdsMessage] = useState("");
    const [adsError, setAdsError] = useState("");


    // Step 3 — functions

    const adsFetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setAdsCountries(response.data.data.data);
    };


    const adsCreateState = async () => {

        const response = await api.post("/admin/states", {
            country_id: adsCountryId,
            name: adsName,
            code: adsCode,
            status: adsStatus,
        });

        return response.data;
    };


    useEffect(() => {

        const adsLoadCountries = async () => {

            try {

                await adsFetchCountries();

            } catch (error: any) {

                const responseData = error?.response?.data;

                setAdsError(
                    responseData?.message ||
                    "Failed to load countries."
                );
            }
        };

        adsLoadCountries();

    }, []);


    // Step 4 — handlers

    const adsHandleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setAdsLoading(true);
        setAdsMessage("");
        setAdsError("");

        try {

            const data = await adsCreateState();

            setAdsMessage(
                data.message || "State created successfully."
            );

            setAdsCountryId("");
            setAdsName("");
            setAdsCode("");
            setAdsStatus("active");

        } catch (error: any) {

            const responseData = error?.response?.data;

            if (responseData?.errors) {

                const firstError = Object.values(
                    responseData.errors
                )
                    .flat()
                    .find(Boolean);

                setAdsError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setAdsError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setAdsLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="ads-container">

            <div className="ads-header">

                <h1 className="ads-title">
                    Add State
                </h1>

                <p className="ads-subtitle">
                    Add a new state to the location master.
                </p>

            </div>


            <form
                className="ads-form"
                onSubmit={adsHandleSubmit}
            >

                <div className="ads-field">

                    <label
                        className="ads-label"
                        htmlFor="ads-country-id"
                    >
                        Country
                    </label>

                    <select
                        id="ads-country-id"
                        className="ads-select"
                        value={adsCountryId}
                        onChange={(e) =>
                            setAdsCountryId(e.target.value)
                        }
                        required
                    >

                        <option value="">
                            Select Country
                        </option>

                        {adsCountries.map((country) => (
                            <option
                                key={country.id}
                                value={country.id}
                            >
                                {country.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="ads-field">

                    <label
                        className="ads-label"
                        htmlFor="ads-name"
                    >
                        State Name
                    </label>

                    <input
                        id="ads-name"
                        type="text"
                        className="ads-input"
                        value={adsName}
                        onChange={(e) =>
                            setAdsName(e.target.value)
                        }
                        placeholder="e.g. Assam"
                        required
                    />

                </div>


                <div className="ads-field">

                    <label
                        className="ads-label"
                        htmlFor="ads-code"
                    >
                        State Code
                    </label>

                    <input
                        id="ads-code"
                        type="text"
                        className="ads-input"
                        value={adsCode}
                        onChange={(e) =>
                            setAdsCode(e.target.value)
                        }
                        placeholder="e.g. AS"
                        maxLength={20}
                    />

                </div>


                <div className="ads-field">

                    <label
                        className="ads-label"
                        htmlFor="ads-status"
                    >
                        Status
                    </label>

                    <select
                        id="ads-status"
                        className="ads-select"
                        value={adsStatus}
                        onChange={(e) =>
                            setAdsStatus(e.target.value)
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


                {adsMessage && (
                    <div className="ads-success">
                        {adsMessage}
                    </div>
                )}


                {adsError && (
                    <div className="ads-error">
                        {adsError}
                    </div>
                )}


                <button
                    type="submit"
                    className="ads-submit"
                    disabled={adsLoading}
                >
                    {adsLoading
                        ? "Creating..."
                        : "Create State"}
                </button>

            </form>

        </div>
    );
};


export default AddState;