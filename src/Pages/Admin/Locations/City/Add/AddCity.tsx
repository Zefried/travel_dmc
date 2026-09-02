// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import "../../Styles/City.css";


// Step 2 — types

type Country = {
    id: number;
    name: string;
    code: string;
    status: string;
};

type State = {
    id: number;
    country_id: number;
    name: string;
    code: string;
    status: string;
};


// Step 3 — component

const AddCity = () => {

    // Step 4 — state

    const [adcCountries, setAdcCountries] = useState<Country[]>([]);
    const [adcCountryId, setAdcCountryId] = useState("");

    const [adcStates, setAdcStates] = useState<State[]>([]);
    const [adcStateId, setAdcStateId] = useState("");

    const [adcName, setAdcName] = useState("");
    const [adcCode, setAdcCode] = useState("");
    const [adcStatus, setAdcStatus] = useState("active");

    const [adcLoading, setAdcLoading] = useState(false);
    const [adcStatesLoading, setAdcStatesLoading] = useState(false);

    const [adcMessage, setAdcMessage] = useState("");
    const [adcError, setAdcError] = useState("");


    // Step 5 — functions

    const adcFetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setAdcCountries(response.data.data.data);
    };


    const adcFetchStates = async (countryId: string) => {

        const response = await api.get("/admin/states/options", {
            params: {
                country_id: countryId,
            },
        });

        setAdcStates(response.data.data);
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


    // Step 6 — effects

    useEffect(() => {

        const adcLoadCountries = async () => {

            try {

                await adcFetchCountries();

            } catch (error: any) {

                const responseData = error?.response?.data;

                setAdcError(
                    responseData?.message ||
                    "Failed to load countries."
                );
            }
        };

        adcLoadCountries();

    }, []);


    // Step 7 — handlers

    const adcHandleCountryChange = async (
        value: string
    ) => {

        setAdcCountryId(value);
        setAdcStateId("");
        setAdcStates([]);
        setAdcError("");
        setAdcMessage("");

        if (!value) {
            return;
        }

        setAdcStatesLoading(true);

        try {

            await adcFetchStates(value);

        } catch (error: any) {

            const responseData = error?.response?.data;

            setAdcStates([]);

            setAdcError(
                responseData?.message ||
                "Failed to load states."
            );

        } finally {

            setAdcStatesLoading(false);
        }
    };


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
                data.message ||
                "City created successfully."
            );

            setAdcCountryId("");
            setAdcStateId("");
            setAdcStates([]);
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


    // Step 8 — return()

    return (
        <div className="acy-container">

            <div className="acy-header">

                <h1 className="acy-title">
                    Add City
                </h1>

                <p className="acy-subtitle">
                    Add a new city to the location master.
                </p>

            </div>


            <form
                className="acy-form"
                onSubmit={adcHandleSubmit}
            >

                <div className="acy-field">

                    <label
                        className="acy-label"
                        htmlFor="acy-country-id"
                    >
                        Country
                    </label>

                    <select
                        id="acy-country-id"
                        className="acy-select"
                        value={adcCountryId}
                        onChange={(e) =>
                            adcHandleCountryChange(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Country
                        </option>

                        {adcCountries.map((country) => (
                            <option
                                key={country.id}
                                value={country.id}
                            >
                                {country.name}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="acy-field">

                    <label
                        className="acy-label"
                        htmlFor="acy-state-id"
                    >
                        State
                    </label>

                    <select
                        id="acy-state-id"
                        className="acy-select"
                        value={adcStateId}
                        onChange={(e) =>
                            setAdcStateId(e.target.value)
                        }
                        disabled={
                            !adcCountryId ||
                            adcStatesLoading
                        }
                        required
                    >

                        <option value="">
                            {adcStatesLoading
                                ? "Loading states..."
                                : "Select State"}
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


                <div className="acy-field">

                    <label
                        className="acy-label"
                        htmlFor="acy-name"
                    >
                        City Name
                    </label>

                    <input
                        id="acy-name"
                        type="text"
                        className="acy-input"
                        value={adcName}
                        onChange={(e) =>
                            setAdcName(e.target.value)
                        }
                        placeholder="e.g. Guwahati"
                        required
                    />

                </div>


                <div className="acy-field">

                    <label
                        className="acy-label"
                        htmlFor="acy-code"
                    >
                        City Code
                    </label>

                    <input
                        id="acy-code"
                        type="text"
                        className="acy-input"
                        value={adcCode}
                        onChange={(e) =>
                            setAdcCode(e.target.value)
                        }
                        placeholder="e.g. GHY"
                        maxLength={20}
                    />

                </div>


                <div className="acy-field">

                    <label
                        className="acy-label"
                        htmlFor="acy-status"
                    >
                        Status
                    </label>

                    <select
                        id="acy-status"
                        className="acy-select"
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
                    <div className="acy-success">
                        {adcMessage}
                    </div>
                )}


                {adcError && (
                    <div className="acy-error">
                        {adcError}
                    </div>
                )}


                <button
                    type="submit"
                    className="acy-submit"
                    disabled={
                        adcLoading ||
                        adcStatesLoading
                    }
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