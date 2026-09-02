// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import StateSearch from "./StateSearch";
import StateSearchResult from "./StateSearchResult";


// Step 2 — types

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

const ViewStates = () => {

    // Step 4 — state

    const [search, setSearch] = useState<string>("");
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);

    const [editName, setEditName] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");


    // Step 5 — functions

    const fetchStates = async (searchValue: string) => {

        const response = await api.get("/admin/states", {
            params: {
                search: searchValue,
            },
        });

        setStates(response.data.data);
    };


    const updateState = async () => {

        if (!selectedState) {
            return;
        }

        if (!editName.trim()) {
            setError("State name is required.");
            return;
        }

        setUpdating(true);
        setError("");

        try {

            const response = await api.patch(
                `/admin/states/${selectedState.id}`,
                {
                    name: editName.trim(),
                }
            );

            const updatedState: State = {
                ...selectedState,
                ...response.data.data,
            };

            setSelectedState(updatedState);
            setStates([updatedState]);
            setSearch(updatedState.name);
            setEditName(updatedState.name);
            setIsEditing(false);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to update state."
            );

        } finally {

            setUpdating(false);
        }
    };


    // Step 6 — search effect

    useEffect(() => {

        if (
            selectedState &&
            search === selectedState.name
        ) {
            return;
        }

        if (search.length < 3) {
            setStates([]);
            setError("");
            return;
        }

        const loadStates = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchStates(search);

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to search states."
                );

                setStates([]);

            } finally {

                setLoading(false);
            }
        };

        loadStates();

    }, [search, selectedState]);


    // Step 7 — handlers

    const handleSearchChange = (value: string) => {

        setSearch(value);

        if (
            selectedState &&
            value !== selectedState.name
        ) {
            setSelectedState(null);
            setIsEditing(false);
        }
    };


    const handleSuggestionSelect = (state: State) => {

        setSelectedState(state);
        setSearch(state.name);
        setStates([state]);
        setEditName(state.name);
        setError("");
        setIsEditing(false);
    };


    const handleEditClick = () => {

        if (!selectedState) {
            return;
        }

        setEditName(selectedState.name);
        setError("");
        setIsEditing(true);
    };


    const handleCancelEdit = () => {

        if (!selectedState) {
            return;
        }

        setEditName(selectedState.name);
        setError("");
        setIsEditing(false);
    };


    // Step 8 — return()

    return (
        <div>

            <h1>
                States
            </h1>


            <StateSearch
                search={search}
                onSearchChange={handleSearchChange}
                states={states}
                loading={loading}
                selectedState={selectedState}
                onSuggestionSelect={handleSuggestionSelect}
            />


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading &&
                !error &&
                states.length === 0 &&
                search.length >= 3 &&
                !selectedState && (

                    <p>
                        No states found.
                    </p>
                )}


            {selectedState && (

                <StateSearchResult
                    selectedState={selectedState}
                    editName={editName}
                    isEditing={isEditing}
                    updating={updating}
                    onEditNameChange={setEditName}
                    onEditClick={handleEditClick}
                    onSave={updateState}
                    onCancel={handleCancelEdit}
                />
            )}

        </div>
    );
};


export default ViewStates;