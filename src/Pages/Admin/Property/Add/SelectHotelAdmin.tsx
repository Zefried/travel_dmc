// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";


type HotelAdmin = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
};


type SelectHotelAdminProps = {
    selectedHotelAdmin: HotelAdmin | null;
    onSelect: (hotelAdmin: HotelAdmin) => void;
    onRemove: () => void;
};


const SelectHotelAdmin = ({
    selectedHotelAdmin,
    onSelect,
    onRemove,
}: SelectHotelAdminProps) => {

    // Step 2 — state

    const [searchQuery, setSearchQuery] = useState("");
    const [hotelAdmins, setHotelAdmins] = useState<HotelAdmin[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const searchHotelAdmins = async (query: string) => {

        const response = await api.get(
            `/admin/hotel-admins/search?query=${encodeURIComponent(query)}`
        );

        setHotelAdmins(response.data.data);
    };


    useEffect(() => {

        const query = searchQuery.trim();

        if (query.length < 3) {

            setHotelAdmins([]);
            setError("");

            return;
        }

        const timer = setTimeout(async () => {

            setLoading(true);
            setError("");

            try {

                await searchHotelAdmins(query);

            } catch (error: any) {

                setHotelAdmins([]);

                setError(
                    error?.response?.data?.message ||
                    "Failed to search hotel admins."
                );

            } finally {

                setLoading(false);
            }

        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [searchQuery]);


    // Step 4 — handlers

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setSearchQuery(e.target.value);
    };


    const handleSelect = (
        hotelAdmin: HotelAdmin
    ) => {

        setSearchQuery("");
        setHotelAdmins([]);
        setError("");

        onSelect(hotelAdmin);
    };


    const handleRemove = () => {

        setSearchQuery("");
        setHotelAdmins([]);
        setError("");

        onRemove();
    };


    // Step 5 — return()

    return (
        <div className="adsh-container">

            <div className="adsh-header">

                <h2 className="adsh-title">
                    Select Hotel Admin
                </h2>

                <p className="adsh-subtitle">
                    Search by email or phone.
                </p>

            </div>


            <div className="adsh-search">

                <input
                    id="adsh-search"
                    type="text"
                    className="adsh-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter email or phone"
                />

            </div>


            {loading && (
                <div className="adsh-loading">
                    Searching...
                </div>
            )}


            {error && (
                <div className="adsh-error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                hotelAdmins.length === 0 &&
                searchQuery.trim().length >= 3 && (
                    <div className="adsh-empty">
                        No hotel admins found.
                    </div>
                )}


            {hotelAdmins.length > 0 && (
                <div className="adsh-results">

                    {hotelAdmins.map((hotelAdmin) => (

                        <div
                            key={hotelAdmin.id}
                            className="adsh-result"
                        >

                            <div className="adsh-info">

                                <h3 className="adsh-name">
                                    {hotelAdmin.name}
                                </h3>

                                {hotelAdmin.email && (
                                    <p className="adsh-email">
                                        {hotelAdmin.email}
                                    </p>
                                )}

                                {hotelAdmin.phone && (
                                    <p className="adsh-phone">
                                        {hotelAdmin.phone}
                                    </p>
                                )}

                            </div>


                            <button
                                type="button"
                                className="adsh-select-button"
                                onClick={() =>
                                    handleSelect(hotelAdmin)
                                }
                            >
                                Select
                            </button>

                        </div>

                    ))}

                </div>
            )}


            {selectedHotelAdmin && (
                <div className="adsh-selected">

                    <div className="adsh-selected-label">
                        Selected Hotel Admin
                    </div>

                    <div className="adsh-selected-info">

                        <div className="adsh-info">

                            <h3 className="adsh-name">
                                {selectedHotelAdmin.name}
                            </h3>

                            {selectedHotelAdmin.email && (
                                <p className="adsh-email">
                                    {selectedHotelAdmin.email}
                                </p>
                            )}

                            {selectedHotelAdmin.phone && (
                                <p className="adsh-phone">
                                    {selectedHotelAdmin.phone}
                                </p>
                            )}

                        </div>


                        <button
                            type="button"
                            className="adsh-remove-button"
                            onClick={handleRemove}
                        >
                            Remove
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};


export default SelectHotelAdmin;