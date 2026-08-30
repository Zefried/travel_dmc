// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";


type PropertyLocation = {
    countryId: string;
    stateId: string;
    cityId: string;
};


type SelectPropertyLocationProps = {
    selectedLocation: PropertyLocation | null;
    onContinue: (
        countryId: string,
        stateId: string,
        cityId: string
    ) => void;
    onLocationChange: () => void;
};


const SelectPropertyLocation = ({
    selectedLocation,
    onContinue,
    onLocationChange,
}: SelectPropertyLocationProps) => {

    // Step 2 — state

    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [countryId, setCountryId] = useState(
        selectedLocation?.countryId || ""
    );

    const [stateId, setStateId] = useState(
        selectedLocation?.stateId || ""
    );

    const [cityId, setCityId] = useState(
        selectedLocation?.cityId || ""
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const fetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setCountries(response.data.data.data);
    };


    const fetchStates = async (countryId: string) => {

        const response = await api.get(
            `/admin/states?country_id=${countryId}`
        );

        setStates(response.data.data.data);
    };


    const fetchCities = async (stateId: string) => {

        const response = await api.get(
            `/admin/cities?state_id=${stateId}`
        );

        setCities(response.data.data.data);
    };


    useEffect(() => {

        const loadCountries = async () => {

            try {

                await fetchCountries();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load countries."
                );
            }
        };

        loadCountries();

    }, []);


    useEffect(() => {

        if (!selectedLocation) {
            return;
        }

        setCountryId(selectedLocation.countryId);
        setStateId(selectedLocation.stateId);
        setCityId(selectedLocation.cityId);

    }, [selectedLocation]);


    // Step 4 — handlers

    const handleCountryChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const selectedCountryId = e.target.value;

        setCountryId(selectedCountryId);
        setStateId("");
        setCityId("");

        setStates([]);
        setCities([]);

        setError("");

        if (selectedLocation) {
            onLocationChange();
        }

        if (!selectedCountryId) {
            return;
        }

        setLoading(true);

        try {

            await fetchStates(selectedCountryId);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to load states."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleStateChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const selectedStateId = e.target.value;

        setStateId(selectedStateId);
        setCityId("");

        setCities([]);
        setError("");

        if (selectedLocation) {
            onLocationChange();
        }

        if (!selectedStateId) {
            return;
        }

        setLoading(true);

        try {

            await fetchCities(selectedStateId);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to load cities."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleCityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setCityId(e.target.value);
        setError("");

        if (selectedLocation) {
            onLocationChange();
        }
    };


    const handleContinue = () => {

        if (!countryId || !stateId || !cityId) {

            setError(
                "Please select country, state and city."
            );

            return;
        }

        setError("");

        onContinue(
            countryId,
            stateId,
            cityId
        );
    };


    // Step 5 — return()

    return (
        <div className="spl-container">

            <div className="spl-header">

                <h2 className="spl-title">
                    Select Property Location
                </h2>

                <p className="spl-subtitle">
                    Select the country, state and city.
                </p>

            </div>


            <div className="spl-field">

                <label
                    className="spl-label"
                    htmlFor="spl-country"
                >
                    Country
                </label>

                <select
                    id="spl-country"
                    className="spl-select"
                    value={countryId}
                    onChange={handleCountryChange}
                >

                    <option value="">
                        Select Country
                    </option>

                    {countries.map((country) => (
                        <option
                            key={country.id}
                            value={country.id}
                        >
                            {country.name}
                        </option>
                    ))}

                </select>

            </div>


            <div className="spl-field">

                <label
                    className="spl-label"
                    htmlFor="spl-state"
                >
                    State
                </label>

                <select
                    id="spl-state"
                    className="spl-select"
                    value={stateId}
                    onChange={handleStateChange}
                    disabled={!countryId}
                >

                    <option value="">
                        Select State
                    </option>

                    {states.map((state) => (
                        <option
                            key={state.id}
                            value={state.id}
                        >
                            {state.name}
                        </option>
                    ))}

                </select>

            </div>


            <div className="spl-field">

                <label
                    className="spl-label"
                    htmlFor="spl-city"
                >
                    City
                </label>

                <select
                    id="spl-city"
                    className="spl-select"
                    value={cityId}
                    onChange={handleCityChange}
                    disabled={!stateId}
                >

                    <option value="">
                        Select City
                    </option>

                    {cities.map((city) => (
                        <option
                            key={city.id}
                            value={city.id}
                        >
                            {city.name}
                        </option>
                    ))}

                </select>

            </div>


            {loading && (
                <div className="spl-loading">
                    Loading...
                </div>
            )}


            {error && (
                <div className="spl-error">
                    {error}
                </div>
            )}


            <button
                type="button"
                className="spl-continue"
                onClick={handleContinue}
                disabled={loading}
            >
                Continue
            </button>

        </div>
    );
};


export default SelectPropertyLocation;