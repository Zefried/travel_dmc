// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../../api/axios";
// import "./AddCity.css";


const AddCity = () => {

    // Step 2 — state

    const [adcStates, setAdcStates] = useState<any[]>([]);
    const [adcStateId, setAdcStateId] = useState("");

    const [adcName, setAdcName] = useState("");
    const [adcCode, setAdcCode] = useState("");
    const [adcStatus, setAdcStatus] = useState("active");

    const [adcLoading, setAdcLoading] = useState(false);
    const [adcMessage, setAdcMessage] = useState("");
    const [adcError, setAdcError] = useState("");


    // Step 3 — functions

    const adcFetchStates = async () => {

        const response = await api.get("/admin/states");

        setAdcStates(response.data.data.data);
    };


    const adcCreateCity = async () => {

        const response = await api.post("/admin/cities", {
            state_id: adcStateId,
            name: adcName,
            code: adcCode,
            status: adcStatus,
        });

        return response.data;
    };


    useEffect(() => {

        const adcLoadStates = async () => {

            try {

                await adcFetchStates();

            } catch (error: any) {

                const responseData = error?.response?.data;

                setAdcError(
                    responseData?.message ||
                    "Failed to load states."
                );
            }
        };

        adcLoadStates();

    }, []);


    // Step 4 — handlers

    const adcHandleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setAdcLoading(true);
        setAdcMessage("");
        setAdcError("");

        try {

            const data = await adcCreateCity();

            setAdcMessage(
                data.message || "City created successfully."
            );

            setAdcStateId("");
            setAdcName("");
            setAdcCode("");
            setAdcStatus("active");

        } catch (error: any) {

            const responseData = error?.response?.data;

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

        } finally {

            setAdcLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div className="adc-container">

            <div className="adc-header">

                <h1 className="adc-title">
                    Add City
                </h1>

                <p className="adc-subtitle">
                    Add a new city to the location master.
                </p>

            </div>


            <form
                className="adc-form"
                onSubmit={adcHandleSubmit}
            >

                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-state-id"
                    >
                        State
                    </label>

                    <select
                        id="adc-state-id"
                        className="adc-select"
                        value={adcStateId}
                        onChange={(e) =>
                            setAdcStateId(e.target.value)
                        }
                        required
                    >

                        <option value="">
                            Select State
                        </option>

                        {adcStates.map((state) => (
                            <option
                                key={state.id}
                                value={state.id}
                            >
                                {state.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-name"
                    >
                        City Name
                    </label>

                    <input
                        id="adc-name"
                        type="text"
                        className="adc-input"
                        value={adcName}
                        onChange={(e) =>
                            setAdcName(e.target.value)
                        }
                        placeholder="e.g. Guwahati"
                        required
                    />

                </div>


                <div className="adc-field">

                    <label
                        className="adc-label"
                        htmlFor="adc-code"
                    >
                        City Code
                    </label>

                    <input
                        id="adc-code"
                        type="text"
                        className="adc-input"
                        value={adcCode}
                        onChange={(e) =>
                            setAdcCode(e.target.value)
                        }
                        placeholder="e.g. GHY"
                        maxLength={20}
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
                        : "Create City"}
                </button>

            </form>

        </div>
    );
};


export default AddCity;