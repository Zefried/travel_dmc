// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import './Styles/SelectPropertyRoomType.css';


type Property = {
    id: number;
    name: string;
    country: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    hotel_admin: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
};


type SelectPropertyProps = {
    selectedProperty: Property | null;
    onSelect: (property: Property) => void;
    onRemove: () => void;
};


const SelectProperty = ({
    selectedProperty,
    onSelect,
    onRemove,
}: SelectPropertyProps) => {

    // Step 2 — state

    const [searchQuery, setSearchQuery] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const searchProperties = async (query: string) => {

        const response = await api.get(
            `/hotel/properties/room-types?query=${encodeURIComponent(query)}`
        );

        setProperties(response.data.data);
    };


    useEffect(() => {

        const query = searchQuery.trim();

        if (query.length < 3) {

            setProperties([]);
            setError("");

            return;
        }

        const timer = setTimeout(async () => {

            setLoading(true);
            setError("");

            try {

                await searchProperties(query);

            } catch (error: any) {

                setProperties([]);

                setError(
                    error?.response?.data?.message ||
                    "Failed to search properties."
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
        property: Property
    ) => {

        setSearchQuery("");
        setProperties([]);
        setError("");

        onSelect(property);
    };


    const handleRemove = () => {

        setSearchQuery("");
        setProperties([]);
        setError("");

        onRemove();
    };


    // Step 5 — return()

   return (
    <div className="sprt-container">

        <div className="sprt-header">

            <h2 className="sprt-title">
                Select Property
            </h2>

            <p className="sprt-subtitle">
                Search by property name, hotel admin phone or email.
            </p>

        </div>


        <div className="sprt-search">

            <input
                id="sprt-search"
                type="text"
                className="sprt-input"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search property, phone or email"
            />

        </div>


        {loading && (
            <div className="sprt-loading">
                Searching...
            </div>
        )}


        {error && (
            <div className="sprt-error">
                {error}
            </div>
        )}


        {!loading &&
            !error &&
            properties.length === 0 &&
            searchQuery.trim().length >= 3 && (
                <div className="sprt-empty">
                    No properties found.
                </div>
            )}


        {properties.length > 0 && (
            <div className="sprt-results">

                {properties.map((property) => (

                    <div
                        key={property.id}
                        className="sprt-result"
                    >

                        <div className="sprt-info">

                            <h3 className="sprt-name">
                                {property.name}
                            </h3>

                            <p className="sprt-location">
                                {property.country.name},{" "}
                                {property.city.name}
                            </p>

                            <p className="sprt-admin">
                                Hotel Admin:{" "}
                                {property.hotel_admin.name}
                            </p>

                            {property.hotel_admin.phone && (
                                <p className="sprt-phone">
                                    {property.hotel_admin.phone}
                                </p>
                            )}

                            {property.hotel_admin.email && (
                                <p className="sprt-email">
                                    {property.hotel_admin.email}
                                </p>
                            )}

                        </div>


                        <button
                            type="button"
                            className="sprt-select-button"
                            onClick={() =>
                                handleSelect(property)
                            }
                        >
                            Select
                        </button>

                    </div>

                ))}

            </div>
        )}


        {selectedProperty && (
            <div className="sprt-selected">

                <div className="sprt-selected-info">

                    <div className="sprt-selected-label">
                        Selected Property
                    </div>

                    <h3 className="sprt-name">
                        {selectedProperty.name}
                    </h3>

                    <p className="sprt-location">
                        {selectedProperty.country.name},{" "}
                        {selectedProperty.city.name}
                    </p>

                    <p className="sprt-admin">
                        Hotel Admin:{" "}
                        {selectedProperty.hotel_admin.name}
                    </p>

                    {selectedProperty.hotel_admin.phone && (
                        <p className="sprt-phone">
                            {selectedProperty.hotel_admin.phone}
                        </p>
                    )}

                    {selectedProperty.hotel_admin.email && (
                        <p className="sprt-email">
                            {selectedProperty.hotel_admin.email}
                        </p>
                    )}

                </div>


                <button
                    type="button"
                    className="sprt-remove-button"
                    onClick={handleRemove}
                >
                    Remove
                </button>

            </div>
        )}

    </div>
);



};


export default SelectProperty;