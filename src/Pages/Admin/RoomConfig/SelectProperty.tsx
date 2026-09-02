// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../api/axios";
import './Styles/SelectPropertyRoomConfig.css';


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
            `/hotel/properties/for-room-configuration?query=${encodeURIComponent(
                query
            )}`
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
    <div className="sprc-container">

        <div className="sprc-header">

            <h2 className="sprc-title">
                Select Property
            </h2>

            <p className="sprc-subtitle">
                Search for the property for this room configuration.
            </p>

        </div>


        {!selectedProperty && (
            <div className="sprc-search">

                <input
                    type="text"
                    className="sprc-input"
                    value={searchQuery}
                    onChange={(e) =>
                        setSearchQuery(e.target.value)
                    }
                    placeholder="Search property, phone or email"
                />

            </div>
        )}


        {loading && (
            <div className="sprc-loading">
                Searching...
            </div>
        )}


        {error && (
            <div className="sprc-error">
                {error}
            </div>
        )}


        {!loading &&
            !error &&
            searchQuery.trim().length >= 3 &&
            properties.length === 0 && (
                <div className="sprc-empty">
                    No properties found.
                </div>
            )}


        {!selectedProperty &&
            properties.length > 0 && (
                <div className="sprc-results">

                    {properties.map((property) => (

                        <div
                            key={property.id}
                            className="sprc-result"
                        >

                            <div className="sprc-info">

                                <h3 className="sprc-name">
                                    {property.name}
                                </h3>

                                <p className="sprc-location">
                                    {property.country.name},{" "}
                                    {property.city.name}
                                </p>

                                <p className="sprc-admin">
                                    Hotel Admin:{" "}
                                    {property.hotel_admin.name}
                                </p>

                                {property.hotel_admin.phone && (
                                    <p className="sprc-phone">
                                        {property.hotel_admin.phone}
                                    </p>
                                )}

                            </div>


                            <button
                                type="button"
                                className="sprc-select-button"
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
            <div className="sprc-selected">

                <div className="sprc-selected-info">

                    <div className="sprc-selected-label">
                        Selected Property
                    </div>

                    <h3 className="sprc-name">
                        {selectedProperty.name}
                    </h3>

                    <p className="sprc-location">
                        {selectedProperty.country.name},{" "}
                        {selectedProperty.city.name}
                    </p>

                    <p className="sprc-admin">
                        Hotel Admin:{" "}
                        {selectedProperty.hotel_admin.name}
                    </p>

                    {selectedProperty.hotel_admin.phone && (
                        <p className="sprc-phone">
                            {selectedProperty.hotel_admin.phone}
                        </p>
                    )}

                </div>


                <button
                    type="button"
                    className="sprc-remove-button"
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