// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import { Link } from "react-router-dom";
import Pagination from "../../../../../Components/Pagination/Pagination";


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

type City = {
    id: number;
    state_id: number;
    name: string;
    code: string;
    status: string;
};


// Step 3 — component

const CityList = () => {

    // Step 4 — state

    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState<string>("");

    const [states, setStates] = useState<State[]>([]);
    const [selectedStateId, setSelectedStateId] = useState<string>("");

    const [cities, setCities] = useState<City[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);

    const [loading, setLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);

    const [error, setError] = useState("");
    const [statesError, setStatesError] = useState("");
    const [citiesError, setCitiesError] = useState("");


    // Step 5 — functions

    const fetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setCountries(response.data.data.data);
    };


    const fetchStates = async (countryId: string) => {

        const response = await api.get("/admin/states/options", {
            params: {
                country_id: countryId,
            },
        });

        setStates(response.data.data);
    };


    const fetchCities = async (
        stateId: string,
        page: number
    ) => {

        const response = await api.get("/admin/cities", {
            params: {
                state_id: stateId,
                page: page,
            },
        });

        setCities(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setLastPage(response.data.data.last_page);
    };


    // Step 6 — effects

    useEffect(() => {

        const loadCountries = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchCountries();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load countries."
                );

            } finally {

                setLoading(false);
            }
        };

        loadCountries();

    }, []);


    // Step 7 — handlers

    const handleCountryChange = async (value: string) => {

        setSelectedCountryId(value);

        setSelectedStateId("");
        setStates([]);

        setCities([]);

        setCurrentPage(1);
        setLastPage(1);

        setStatesError("");
        setCitiesError("");

        if (!value) {
            return;
        }

        setStatesLoading(true);

        try {

            await fetchStates(value);

        } catch (error: any) {

            setStates([]);

            setStatesError(
                error?.response?.data?.message ||
                "Failed to load states."
            );

        } finally {

            setStatesLoading(false);
        }
    };


    const handleStateChange = async (value: string) => {

        setSelectedStateId(value);

        setCities([]);

        setCurrentPage(1);
        setLastPage(1);

        setCitiesError("");

        if (!value) {
            return;
        }

        setCitiesLoading(true);

        try {

            await fetchCities(value, 1);

        } catch (error: any) {

            setCities([]);

            setCitiesError(
                error?.response?.data?.message ||
                "Failed to load cities."
            );

        } finally {

            setCitiesLoading(false);
        }
    };


    const handlePageChange = async (page: number) => {

        if (
            page < 1 ||
            page > lastPage ||
            !selectedStateId
        ) {
            return;
        }

        setCitiesLoading(true);
        setCitiesError("");

        try {

            await fetchCities(
                selectedStateId,
                page
            );

        } catch (error: any) {

            setCitiesError(
                error?.response?.data?.message ||
                "Failed to load cities."
            );

        } finally {

            setCitiesLoading(false);
        }
    };


    // Step 8 — return()

    return (
        <div className="cl-container">

            <div className="cl-header">

                <h1 className="cl-title">
                    Cities
                </h1>

                <Link
                    to="/dashboard/city-search"
                    className="cl-search-link"
                >
                    Search and edit cities →
                </Link>

            </div>


            {loading && (
                <p className="cl-loading">
                    Loading countries...
                </p>
            )}


            {error && (
                <p className="cl-error">
                    {error}
                </p>
            )}


            {!loading && !error && (

                <div>

                    <div className="cl-field">

                        <label
                            htmlFor="cl-country"
                            className="cl-label"
                        >
                            Country
                        </label>

                        <select
                            id="cl-country"
                            className="cl-select"
                            value={selectedCountryId}
                            onChange={(e) =>
                                handleCountryChange(
                                    e.target.value
                                )
                            }
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


                    {statesLoading && (
                        <p className="cl-loading">
                            Loading states...
                        </p>
                    )}


                    {statesError && (
                        <p className="cl-error">
                            {statesError}
                        </p>
                    )}


                    {selectedCountryId &&
                        !statesLoading &&
                        !statesError && (

                            <div className="cl-field">

                                <label
                                    htmlFor="cl-state"
                                    className="cl-label"
                                >
                                    State
                                </label>

                                <select
                                    id="cl-state"
                                    className="cl-select"
                                    value={selectedStateId}
                                    onChange={(e) =>
                                        handleStateChange(
                                            e.target.value
                                        )
                                    }
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
                        )}


                    {citiesLoading && (
                        <p className="cl-loading">
                            Loading cities...
                        </p>
                    )}


                    {citiesError && (
                        <p className="cl-error">
                            {citiesError}
                        </p>
                    )}


                    {!citiesLoading &&
                        !citiesError &&
                        selectedStateId &&
                        cities.length > 0 && (

                            <>

                                <table className="cl-table">

                                    <thead className="cl-table-head">

                                        <tr>

                                            <th className="cl-table-heading">
                                                City
                                            </th>

                                            <th className="cl-table-heading">
                                                Code
                                            </th>

                                            <th className="cl-table-heading">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="cl-table-body">

                                        {cities.map((city) => (

                                            <tr
                                                key={city.id}
                                                className="cl-table-row"
                                            >

                                                <td className="cl-table-cell">
                                                    {city.name}
                                                </td>

                                                <td className="cl-table-cell">
                                                    {city.code || "—"}
                                                </td>

                                                <td className="cl-table-cell">
                                                    {city.status}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>


                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={lastPage}
                                    onPageChange={handlePageChange}
                                />

                            </>
                        )}


                    {!citiesLoading &&
                        !citiesError &&
                        selectedStateId &&
                        cities.length === 0 && (

                            <p className="cl-empty">
                                No cities found for this state.
                            </p>
                        )}

                </div>
            )}

        </div>
    );
};


export default CityList;