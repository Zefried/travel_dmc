// Step 1 — imports

import { useState } from "react";
import SelectProperty from "./SelectProperty";
import SelectAmenities from "./SelectAmenities";
import api from "../../../../api/axios";


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


type Amenity = {
    id: number;
    category: string;
    name: string;
    description: string | null;
    status: string;
};


const AssignToProperty = () => {

    // Step 2 — state

    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [selectedAmenities, setSelectedAmenities] =
        useState<Amenity[]>([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 3 — functions


    // Step 4 — handlers

    const handlePropertySelect = (
        property: Property
    ) => {

        setSelectedProperty(property);
        setSelectedAmenities([]);
        setMessage("");
        setError("");
    };


    const handlePropertyRemove = () => {

        setSelectedProperty(null);
        setSelectedAmenities([]);
        setMessage("");
        setError("");
    };


    const handleSetSelectedAmenities = (
        amenities: Amenity[]
    ) => {

        setSelectedAmenities(amenities);
    };


    const handleAmenitySelect = (
        amenity: Amenity
    ) => {

        setSelectedAmenities((current) => {

            if (
                current.some(
                    (item) => item.id === amenity.id
                )
            ) {
                return current;
            }

            return [...current, amenity];
        });

        setMessage("");
        setError("");
    };


    const handleAmenityUnselect = (
        amenityId: number
    ) => {

        setSelectedAmenities((current) =>
            current.filter(
                (amenity) => amenity.id !== amenityId
            )
        );

        setMessage("");
        setError("");
    };


    const handleExistingAmenityRemove = (
        amenityId: number
    ) => {

        setSelectedAmenities((current) =>
            current.filter(
                (amenity) => amenity.id !== amenityId
            )
        );

        setMessage("");
        setError("");
    };


    const handleSave = async () => {

        if (!selectedProperty) {

            setError("Please select a property.");

            return;
        }

        if (selectedAmenities.length === 0) {

            setError("Please select at least one amenity.");

            return;
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/hotel/amenity-configs",
                {
                    target_type: "property",
                    property_id: selectedProperty.id,
                    property_amenity_ids:
                        selectedAmenities.map(
                            (amenity) => amenity.id
                        ),
                }
            );

            setMessage(
                response.data?.message ||
                "Amenities saved successfully."
            );

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to save amenities."
            );

        } finally {

            setLoading(false);
        }
    };


    // Step 5 — return()

    return (
        <div>

            <SelectProperty
                selectedProperty={selectedProperty}
                onSelect={handlePropertySelect}
                onRemove={handlePropertyRemove}
            />


            {selectedProperty && (
                <SelectAmenities
                    propertyId={selectedProperty.id}
                    selectedAmenities={selectedAmenities}
                    onSetSelected={handleSetSelectedAmenities}
                    onSelect={handleAmenitySelect}
                    onUnselect={handleAmenityUnselect}
                    onExistingRemove={
                        handleExistingAmenityRemove
                    }
                />
            )}


            {message && (
                <div>
                    {message}
                </div>
            )}


            {error && (
                <div>
                    {error}
                </div>
            )}


            {selectedProperty && (
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                        loading ||
                        selectedAmenities.length === 0
                    }
                >
                    {loading
                        ? "Saving..."
                        : "Save Amenities"}
                </button>
            )}

        </div>
    );
};


export default AssignToProperty;