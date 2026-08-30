// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../api/axios";


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
        <div className="sp-container">

            <div className="sp-header">

                <h2 className="sp-title">
                    Select Property
                </h2>

                <p className="sp-subtitle">
                    Search for the property for this room configuration.
                </p>

            </div>


            {!selectedProperty && (
                <div className="sp-search">

                    <input
                        type="text"
                        className="sp-input"
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(e.target.value)
                        }
                        placeholder="Search property, phone or email"
                    />

                </div>
            )}


            {loading && (
                <div className="sp-loading">
                    Searching...
                </div>
            )}


            {error && (
                <div className="sp-error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                searchQuery.trim().length >= 3 &&
                properties.length === 0 && (
                    <div className="sp-empty">
                        No properties found.
                    </div>
                )}


            {!selectedProperty &&
                properties.length > 0 && (
                    <div className="sp-results">

                        {properties.map((property) => (

                            <div
                                key={property.id}
                                className="sp-result"
                            >

                                <div className="sp-info">

                                    <h3 className="sp-name">
                                        {property.name}
                                    </h3>

                                    <p className="sp-location">
                                        {property.country.name},{" "}
                                        {property.city.name}
                                    </p>

                                    <p className="sp-admin">
                                        Hotel Admin:{" "}
                                        {property.hotel_admin.name}
                                    </p>

                                    {property.hotel_admin.phone && (
                                        <p className="sp-phone">
                                            {property.hotel_admin.phone}
                                        </p>
                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="sp-select-button"
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
                <div className="sp-selected">

                    <div className="sp-selected-info">

                        <div className="sp-selected-label">
                            Selected Property
                        </div>

                        <h3 className="sp-name">
                            {selectedProperty.name}
                        </h3>

                        <p className="sp-location">
                            {selectedProperty.country.name},{" "}
                            {selectedProperty.city.name}
                        </p>

                        <p className="sp-admin">
                            Hotel Admin:{" "}
                            {selectedProperty.hotel_admin.name}
                        </p>

                        {selectedProperty.hotel_admin.phone && (
                            <p className="sp-phone">
                                {selectedProperty.hotel_admin.phone}
                            </p>
                        )}

                    </div>


                    <button
                        type="button"
                        className="sp-remove-button"
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