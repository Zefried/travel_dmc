// Step 1 — imports

import { useState } from "react";
import SelectRoomType from "./SelectRoomType";
import SelectAmenities from "../AssignToProperty/SelectAmenities";
import api from "../../../../api/axios";


// Step 2 — types

type RoomType = {
    id: number;
    name: string;
    type: string;
    bedroom: number;

    property: {
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
    };
};


type Amenity = {
    id: number;
    category: string;
    name: string;
    description: string | null;
    status: string;
};


const AssignToRoomType = () => {

    // Step 3 — state

    const [selectedRoomType, setSelectedRoomType] =
        useState<RoomType | null>(null);

    const [selectedAmenities, setSelectedAmenities] =
        useState<Amenity[]>([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Step 4 — functions

    const saveAmenities = async () => {

        if (!selectedRoomType) {
            return;
        }

        const response = await api.post(
            "/hotel/amenity-configs",
            {
                target_type: "room_type",
                room_type_id: selectedRoomType.id,
                property_amenity_ids: selectedAmenities.map(
                    (amenity) => amenity.id
                ),
            }
        );

        return response.data;
    };


    // Step 5 — handlers

    const handleRoomTypeSelect = (
        roomType: RoomType
    ) => {

        setSelectedRoomType(roomType);
        setSelectedAmenities([]);

        setMessage("");
        setError("");
    };


    const handleRoomTypeRemove = () => {

        setSelectedRoomType(null);
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

        if (!selectedRoomType) {
            setError("Please select a room type.");

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

            const data = await saveAmenities();

            setMessage(
                data?.message ||
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


    // Step 6 — return()

    return (
        <div>

            <SelectRoomType
                selectedRoomType={selectedRoomType}
                onSelect={handleRoomTypeSelect}
                onRemove={handleRoomTypeRemove}
            />


            {selectedRoomType && (
                <SelectAmenities
                    roomTypeId={selectedRoomType.id}
                    selectedAmenities={selectedAmenities}
                    onSetSelected={handleSetSelectedAmenities}
                    onSelect={handleAmenitySelect}
                    onUnselect={handleAmenityUnselect}
                    onExistingRemove={handleExistingAmenityRemove}
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


            {selectedRoomType && (
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


export default AssignToRoomType;