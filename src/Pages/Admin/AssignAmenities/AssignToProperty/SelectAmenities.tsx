// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";


type Amenity = {
    id: number;
    category: string;
    name: string;
    description: string | null;
    status: string;
};


type SelectAmenitiesProps = {
    propertyId: number;
    selectedAmenities: Amenity[];
    onSetSelected: (amenities: Amenity[]) => void;
    onSelect: (amenity: Amenity) => void;
    onRemove: (amenityId: number) => void;
};


const SelectAmenities = ({
    propertyId,
    selectedAmenities,
    onSetSelected,
    onSelect,
    onRemove,
}: SelectAmenitiesProps) => {

    // Step 2 — state

    const [amenities, setAmenities] = useState<Amenity[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const fetchAmenities = async () => {

        const response = await api.get(
            "/hotel/amenities"
        );

        return response.data.data;
    };


    const fetchExistingAmenities = async () => {

        const response = await api.get(
            `/hotel/properties/${propertyId}/amenities`
        );

        return response.data.data;
    };


    const isSelected = (
        amenityId: number
    ) => {

        return selectedAmenities.some(
            (amenity) => amenity.id === amenityId
        );
    };


    useEffect(() => {

        const loadAmenities = async () => {

            setLoading(true);
            setError("");

            try {

                const [
                    allAmenities,
                    existingAmenities,
                ] = await Promise.all([
                    fetchAmenities(),
                    fetchExistingAmenities(),
                ]);

                setAmenities(allAmenities);

                onSetSelected(existingAmenities);

            } catch (error: any) {

                setAmenities([]);
                onSetSelected([]);

                setError(
                    error?.response?.data?.message ||
                    "Failed to load amenities."
                );

            } finally {

                setLoading(false);
            }
        };

        loadAmenities();

    }, [propertyId]);


    // Step 4 — handlers

    const handleSelect = (
        amenity: Amenity
    ) => {

        if (isSelected(amenity.id)) {
            return;
        }

        onSelect(amenity);
    };


    const handleRemove = (
        amenityId: number
    ) => {

        onRemove(amenityId);
    };


    // Step 5 — return()

    return (
        <div className="sa-container">

            <div className="sa-header">

                <h2 className="sa-title">
                    Select Amenities
                </h2>

                <p className="sa-subtitle">
                    Select one or more amenities for the property.
                </p>

            </div>


            {loading && (
                <div className="sa-loading">
                    Loading amenities...
                </div>
            )}


            {error && (
                <div className="sa-error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                amenities.length === 0 && (
                    <div className="sa-empty">
                        No amenities found.
                    </div>
                )}


            {selectedAmenities.length > 0 && (
                <div className="sa-selected">

                    <h3 className="sa-selected-title">
                        Selected Amenities
                    </h3>


                    <div className="sa-selected-list">

                        {selectedAmenities.map((amenity) => (

                            <div
                                key={amenity.id}
                                className="sa-selected-item"
                            >

                                <div className="sa-selected-info">

                                    <strong className="sa-name">
                                        {amenity.name}
                                    </strong>

                                    <span className="sa-category">
                                        {amenity.category}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="sa-remove-button"
                                    onClick={() =>
                                        handleRemove(amenity.id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>

                </div>
            )}


            {!loading &&
                !error &&
                amenities.length > 0 && (
                    <div className="sa-list">

                        {amenities.map((amenity) => (

                            <div
                                key={amenity.id}
                                className="sa-item"
                            >

                                <div className="sa-info">

                                    <h3 className="sa-name">
                                        {amenity.name}
                                    </h3>

                                    <p className="sa-category">
                                        {amenity.category}
                                    </p>

                                    {amenity.description && (
                                        <p className="sa-description">
                                            {amenity.description}
                                        </p>
                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="sa-select-button"
                                    onClick={() =>
                                        handleSelect(amenity)
                                    }
                                    disabled={isSelected(amenity.id)}
                                >
                                    {isSelected(amenity.id)
                                        ? "Selected"
                                        : "Select"}
                                </button>

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
};


export default SelectAmenities;