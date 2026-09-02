// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../../../api/axios";
import { Link } from "react-router-dom";
import Pagination from "../../../../../../Components/Pagination/Pagination";


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
        <div>

            {loading && (
                <p>
                    Loading countries...
                </p>
            )}


            {error && (
                <p>
                    {error}
                </p>
            )}


            <Link to="/dashboard/states-search">
                Search and edit States
            </Link>


            {!loading && !error && (
                <select
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


            {statesLoading && (
                <p>
                    Loading states...
                </p>
            )}


            {statesError && (
                <p>
                    {statesError}
                </p>
            )}


            {!statesLoading &&
                !statesError &&
                selectedCountryId &&
                states.length > 0 && (

                    <>
                        <table>

                            <thead>
                                <tr>
                                    <th>
                                        State
                                    </th>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Country
                                    </th>

                                    <th>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {states.map((state) => (

                                    <tr key={state.id}>

                                        <td>
                                            {state.name}
                                        </td>

                                        <td>
                                            {state.code}
                                        </td>

                                        <td>
                                            {state.country.name}
                                        </td>

                                        <td>
                                            {state.status}
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


            {!statesLoading &&
                !statesError &&
                selectedCountryId &&
                states.length === 0 && (

                    <p>
                        No states found for this country.
                    </p>
                )}

        </div>
    );
};


export default StateCountryFilter;