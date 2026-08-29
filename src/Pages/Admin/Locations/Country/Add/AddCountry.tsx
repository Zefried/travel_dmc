// Step 1 — imports

import React, { useState } from "react";
import axios from "axios";
import api from "../../../../../api/axios";
// import "./AddCountry.css";


const AddCountry = () => {

    // Step 2 — state

    const [adcName, setAdcName] = useState("");
    const [adcCode, setAdcCode] = useState("");
    const [adcStatus, setAdcStatus] = useState("active");

    const [adcLoading, setAdcLoading] = useState(false);
    const [adcMessage, setAdcMessage] = useState("");
    const [adcError, setAdcError] = useState("");


    // Step 3 — functions

    const adcCreateCountry = async () => {

        const response = await api.post("/admin/countries", {
            name: adcName,
            code: adcCode,
            status: adcStatus,
        });

        return response.data;
    };


    // Step 4 — handlers

    const adcHandleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setAdcLoading(true);
        setAdcMessage("");
        setAdcError("");

        try {

            const data = await adcCreateCountry();

            setAdcMessage(
                data.message || "Country created successfully."
            );

            setAdcName("");
            setAdcCode("");
            setAdcStatus("active");

        } catch (error: any) {

            if (axios.isAxiosError(error)) {

                const responseData = error.response?.data;

                if (responseData?.errors) {

                    const firstError = Object.values(
                        responseData.errors
                    )
                        .flat()
                        .find(Boolean);

                    setAdcError(
                        String(
                            firstError ||
                            responseData.message ||
                            "Validation failed."
                        )
                    );

                } else {

                    setAdcError(
                        responseData?.message ||
                        "Something went wrong."
                    );
                }

            } else {

                setAdcError(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setAdcLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="adc-container">

            <div className="adc-header">

                <h1 className="adc-title">
                    Add Country
                </h1>

                <p className="adc-subtitle">
                    Add a new country to the location master.
                </p>

            </div>


            <form
                className="adc-form"
                onSubmit={adcHandleSubmit}
            >

                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-name"
                    >
                        Country Name
                    </label>

                    <input
                        id="adc-name"
                        type="text"
                        className="adc-input"
                        value={adcName}
                        onChange={(e) =>
                            setAdcName(e.target.value)
                        }
                        placeholder="e.g. India"
                        required
                    />

                </div>


                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-code"
                    >
                        Country Code
                    </label>

                    <input
                        id="adc-code"
                        type="text"
                        className="adc-input"
                        value={adcCode}
                        onChange={(e) =>
                            setAdcCode(e.target.value)
                        }
                        placeholder="e.g. IN"
                        maxLength={10}
                        required
                    />

                </div>


                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-status"
                    >
                        Status
                    </label>

                    <select
                        id="adc-status"
                        className="adc-select"
                        value={adcStatus}
                        onChange={(e) =>
                            setAdcStatus(e.target.value)
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


                {adcMessage && (
                    <div className="adc-success">
                        {adcMessage}
                    </div>
                )}


                {adcError && (
                    <div className="adc-error">
                        {adcError}
                    </div>
                )}


                <button
                    type="submit"
                    className="adc-submit"
                    disabled={adcLoading}
                >
                    {adcLoading
                        ? "Creating..."
                        : "Create Country"}
                </button>

            </form>

        </div>
    );
};


export default AddCountry;