// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import CitySearch from "./CitySearch";
import CitySearchResult from "./CitySearchResult";


// Step 2 — types

type City = {
    id: number;
    state_id: number;
    name: string;
    code: string;
    status: string;
};


// Step 3 — component

const ViewCities = () => {

    // Step 4 — state

    const [search, setSearch] = useState<string>("");
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const [editName, setEditName] = useState<string>("");
    const [editCode, setEditCode] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");


    // Step 5 — functions

    const fetchCities = async (searchValue: string) => {

        const response = await api.get("/admin/cities", {
            params: {
                search: searchValue,
            },
        });

        setCities(response.data.data);
    };


    const updateCity = async () => {

        if (!selectedCity) {
            return;
        }

        if (!editName.trim()) {
            setError("City name is required.");
            return;
        }

        setUpdating(true);
        setError("");

        try {

            const response = await api.patch(
                `/admin/cities/${selectedCity.id}`,
                {
                    name: editName.trim(),
                    code: editCode.trim(),
                }
            );

            const updatedCity: City = {
                ...selectedCity,
                ...response.data.data,
            };

            setSelectedCity(updatedCity);
            setCities([updatedCity]);
            setSearch(updatedCity.name);
            setEditName(updatedCity.name);
            setEditCode(updatedCity.code);
            setIsEditing(false);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to update city."
            );

        } finally {

            setUpdating(false);
        }
    };


    // Step 6 — search effect

    useEffect(() => {

        if (
            selectedCity &&
            search === selectedCity.name
        ) {
            return;
        }

        if (search.length < 3) {
            setCities([]);
            setError("");
            return;
        }

        const loadCities = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchCities(search);

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to search cities."
                );

                setCities([]);

            } finally {

                setLoading(false);
            }
        };

        loadCities();

    }, [search, selectedCity]);


    // Step 7 — handlers

    const handleSearchChange = (value: string) => {

        setSearch(value);

        if (
            selectedCity &&
            value !== selectedCity.name
        ) {
            setSelectedCity(null);
            setIsEditing(false);
        }
    };


    const handleSuggestionSelect = (city: City) => {

        setSelectedCity(city);
        setSearch(city.name);
        setCities([city]);
        setEditName(city.name);
        setEditCode(city.code || "");
        setError("");
        setIsEditing(false);
    };


    const handleEditClick = () => {

        if (!selectedCity) {
            return;
        }

        setEditName(selectedCity.name);
        setEditCode(selectedCity.code || "");
        setError("");
        setIsEditing(true);
    };


    const handleCancelEdit = () => {

        if (!selectedCity) {
            return;
        }

        setEditName(selectedCity.name);
        setEditCode(selectedCity.code || "");
        setError("");
        setIsEditing(false);
    };


    // Step 8 — return()

    return (
        <div>

            <h1>
                Cities
            </h1>


            <CitySearch
                search={search}
                onSearchChange={handleSearchChange}
                cities={cities}
                loading={loading}
                selectedCity={selectedCity}
                onSuggestionSelect={handleSuggestionSelect}
            />


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading &&
                !error &&
                cities.length === 0 &&
                search.length >= 3 &&
                !selectedCity && (

                    <p>
                        No cities found.
                    </p>
                )}


            {selectedCity && (

                <CitySearchResult
                    selectedCity={selectedCity}
                    editName={editName}
                    editCode={editCode}
                    isEditing={isEditing}
                    updating={updating}
                    onEditNameChange={setEditName}
                    onEditCodeChange={setEditCode}
                    onEditClick={handleEditClick}
                    onSave={updateCity}
                    onCancel={handleCancelEdit}
                />

            )}

        </div>
    );
};


export default ViewCities;