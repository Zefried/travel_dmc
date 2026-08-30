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


type ExistingAmenity = Amenity & {
    config_id: number;
};


type SelectAmenitiesProps = {
    propertyId?: number;
    roomTypeId?: number;

    selectedAmenities: Amenity[];

    onSetSelected: (amenities: Amenity[]) => void;
    onSelect: (amenity: Amenity) => void;
    onUnselect: (amenityId: number) => void;
    onExistingRemove: (amenityId: number) => void;
};


const SelectAmenities = ({
    propertyId,
    roomTypeId,
    selectedAmenities,
    onSetSelected,
    onSelect,
    onUnselect,
    onExistingRemove,
}: SelectAmenitiesProps) => {

    // Step 2 — state

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [existingAmenityConfigIds, setExistingAmenityConfigIds] =
        useState<Record<number, number>>({});

    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [error, setError] = useState("");


    // Step 3 — functions

    const fetchAmenities = async () => {

        const response = await api.get(
            "/hotel/amenities"
        );

        return response.data.data;
    };


    const fetchExistingAmenities = async () => {

        if (propertyId) {

            const response = await api.get(
                `/hotel/properties/${propertyId}/amenities`
            );

            return response.data.data;
        }


        if (roomTypeId) {

            const response = await api.get(
                `/hotel/room-types/${roomTypeId}/amenities`
            );

            return response.data.data;
        }


        return [];
    };


    const isSelected = (
        amenityId: number
    ) => {

        return selectedAmenities.some(
            (amenity) => amenity.id === amenityId
        );
    };


    const isExisting = (
        amenityId: number
    ) => {

        return existingAmenityConfigIds[amenityId] !== undefined;
    };


    useEffect(() => {

        const loadAmenities = async () => {

            setLoading(true);
            setError("");

            try {

                const [
                    allAmenities,
                    existingAmenities,
                ]: [
                    Amenity[],
                    ExistingAmenity[]
                ] = await Promise.all([
                    fetchAmenities(),
                    fetchExistingAmenities(),
                ]);


                const configMap: Record<number, number> = {};

                existingAmenities.forEach((amenity) => {

                    configMap[amenity.id] = amenity.config_id;

                });


                setAmenities(allAmenities);
                setExistingAmenityConfigIds(configMap);

                onSetSelected(existingAmenities);

            } catch (error: any) {

                setAmenities([]);
                setExistingAmenityConfigIds({});
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

    }, [propertyId, roomTypeId]);


    // Step 4 — handlers

    const handleSelect = (
        amenity: Amenity
    ) => {

        if (isSelected(amenity.id)) {
            return;
        }

        onSelect(amenity);
    };


    const handleUnselect = (
        amenityId: number
    ) => {

        onUnselect(amenityId);
    };


    const handleExistingRemove = async (
        amenityId: number
    ) => {

        const configId =
            existingAmenityConfigIds[amenityId];

        if (!configId) {
            return;
        }

        setRemovingId(amenityId);
        setError("");

        try {

            await api.delete(
                `/hotel/amenity-configs/${configId}`
            );

            setExistingAmenityConfigIds((current) => {

                const updated = { ...current };

                delete updated[amenityId];

                return updated;
            });

            onExistingRemove(amenityId);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                "Failed to remove amenity."
            );

        } finally {

            setRemovingId(null);
        }
    };


    // Step 5 — return()

    return (
        <div className="sa-container">

            <div className="sa-header">

                <h2 className="sa-title">
                    Select Amenities
                </h2>

                <p className="sa-subtitle">
                    Select one or more amenities.
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


            {selectedAmenities.length > 0 && (
                <div className="sa-selected">

                    <h3 className="sa-selected-title">
                        Selected Amenities
                    </h3>


                    <div className="sa-selected-list">

                        {selectedAmenities.map((amenity) => {

                            const existing =
                                isExisting(amenity.id);

                            return (
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


                                    {existing ? (

                                        <button
                                            type="button"
                                            className="sa-remove-button"
                                            onClick={() =>
                                                handleExistingRemove(
                                                    amenity.id
                                                )
                                            }
                                            disabled={
                                                removingId ===
                                                amenity.id
                                            }
                                        >
                                            {removingId ===
                                            amenity.id
                                                ? "Removing..."
                                                : "Remove"}
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            className="sa-unselect-button"
                                            onClick={() =>
                                                handleUnselect(
                                                    amenity.id
                                                )
                                            }
                                        >
                                            Unselect
                                        </button>

                                    )}

                                </div>
                            );
                        })}

                    </div>

                </div>
            )}


            {!loading &&
                !error &&
                amenities.length === 0 && (
                    <div className="sa-empty">
                        No amenities found.
                    </div>
                )}


            {!loading &&
                !error &&
                amenities.length > 0 && (
                    <div className="sa-list">

                        {amenities.map((amenity) => {

                            const selected =
                                isSelected(amenity.id);

                            return (
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
                                            selected
                                                ? handleUnselect(
                                                      amenity.id
                                                  )
                                                : handleSelect(
                                                      amenity
                                                  )
                                        }
                                    >
                                        {selected
                                            ? "Selected"
                                            : "Select"}
                                    </button>

                                </div>
                            );
                        })}

                    </div>
                )}

        </div>
    );
};


export default SelectAmenities;