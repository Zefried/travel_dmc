// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../../../api/axios";
import { Link } from "react-router-dom";
import Pagination from "../../../../../../Components/Pagination/Pagination";
import './StateCountryFilter.css';

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
    country: {
        id: number;
        name: string;
        code: string;
        status: string;
    };
};


// Step 3 — component

const StateCountryFilter = () => {

    // Step 4 — state

    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState<string>("");

    const [states, setStates] = useState<State[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);

    const [loading, setLoading] = useState(false);
    const [statesLoading, setStatesLoading] = useState(false);

    const [error, setError] = useState("");
    const [statesError, setStatesError] = useState("");


    // Step 5 — functions

    const fetchCountries = async () => {

        const response = await api.get("/admin/countries");

        setCountries(response.data.data.data);
    };


    const fetchStates = async (countryId: string, page: number) => {

        const response = await api.get("/admin/states", {
            params: {
                country_id: countryId,
                page: page,
            },
        });

        setStates(response.data.data.data);
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
        setCurrentPage(1);

        if (!value) {
            setStates([]);
            setStatesError("");
            setLastPage(1);
            return;
        }

        setStatesLoading(true);
        setStatesError("");

        try {

            await fetchStates(value, 1);

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


    const handlePageChange = async (page: number) => {

        if (page < 1 || page > lastPage) {
            return;
        }

        setStatesLoading(true);
        setStatesError("");

        try {

            await fetchStates(selectedCountryId, page);

        } catch (error: any) {

            setStatesError(
                error?.response?.data?.message ||
                "Failed to load states."
            );

        } finally {

            setStatesLoading(false);
        }
    };


    // Step 8 — return()

    return (
        <div className="scf-container">

            <div className="scf-header">

                <div className="scf-filter-section">

                    <label
                        htmlFor="scf-country-select"
                        className="scf-filter-label"
                    >
                        Country
                    </label>

                    {!loading && !error && (
                        <select
                            id="scf-country-select"
                            className="scf-country-select"
                            value={selectedCountryId}
                            onChange={(e) =>
                                handleCountryChange(e.target.value)
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
                    )}

                    {loading && (
                        <p className="scf-loading">
                            Loading countries...
                        </p>
                    )}

                    {error && (
                        <p className="scf-error">
                            {error}
                        </p>
                    )}

                </div>


                <Link
                    to="/dashboard/states-search"
                    className="scf-search-link"
                >
                    Search and edit states
                    <span className="scf-search-arrow">
                        →
                    </span>
                </Link>

            </div>


            {statesLoading && (
                <p className="scf-states-loading">
                    Loading states...
                </p>
            )}


            {statesError && (
                <p className="scf-states-error">
                    {statesError}
                </p>
            )}


            {!statesLoading &&
                !statesError &&
                selectedCountryId &&
                states.length > 0 && (

                    <div className="scf-table-wrapper">

                        <table className="scf-table">

                            <thead className="scf-table-head">

                                <tr>

                                    <th className="scf-table-heading">
                                        State
                                    </th>

                                    <th className="scf-table-heading">
                                        Code
                                    </th>

                                    <th className="scf-table-heading">
                                        Country
                                    </th>

                                    <th className="scf-table-heading">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="scf-table-body">

                                {states.map((state) => (

                                    <tr
                                        key={state.id}
                                        className="scf-table-row"
                                    >

                                        <td className="scf-table-cell">
                                            {state.name}
                                        </td>

                                        <td className="scf-table-cell">
                                            {state.code}
                                        </td>

                                        <td className="scf-table-cell">
                                            {state.country.name}
                                        </td>

                                        <td className="scf-table-cell">
                                            {state.status}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>


                        <div className="scf-pagination">

                            <Pagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                onPageChange={handlePageChange}
                            />

                        </div>

                    </div>
                )}


            {!statesLoading &&
                !statesError &&
                selectedCountryId &&
                states.length === 0 && (

                    <p className="scf-empty">
                        No states found for this country.
                    </p>
                )}

        </div>
    );
};


export default StateCountryFilter;