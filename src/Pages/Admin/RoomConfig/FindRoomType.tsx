// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../api/axios";
import './Styles/FindRoomType.css';


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


type FindRoomTypeProps = {
    propertyId: number;
    selectedRoomType: RoomType | null;
    onSelect: (roomType: RoomType) => void;
    onRemove: () => void;
};


const FindRoomType = ({
    propertyId,
    selectedRoomType,
    onSelect,
    onRemove,
}: FindRoomTypeProps) => {

    // Step 2 — state

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const fetchRoomTypes = async () => {

        const response = await api.get(
            `/hotel/properties/${propertyId}/room-types/for-configuration`
        );

        setRoomTypes(response.data.data);
    };


    useEffect(() => {

        const loadRoomTypes = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchRoomTypes();

            } catch (error: any) {

                setRoomTypes([]);

                setError(
                    error?.response?.data?.message ||
                    "Failed to load room types."
                );

            } finally {

                setLoading(false);
            }
        };

        loadRoomTypes();

    }, [propertyId]);


    // Step 4 — handlers

    const handleSelect = (
        roomType: RoomType
    ) => {

        onSelect(roomType);
    };


    const handleRemove = () => {

        onRemove();
    };


    // Step 5 — return()

    return (
        <div className="frt-container">

            <div className="frt-header">

                <h2 className="frt-title">
                    Find Room Type
                </h2>

                <p className="frt-subtitle">
                    Select a room type for this configuration.
                </p>

            </div>


            {loading && (
                <div className="frt-loading">
                    Loading room types...
                </div>
            )}


            {error && (
                <div className="frt-error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                roomTypes.length === 0 && (
                    <div className="frt-empty">
                        No room types found for this property.
                    </div>
                )}


            {!selectedRoomType &&
                !loading &&
                roomTypes.length > 0 && (
                    <div className="frt-results">

                        {roomTypes.map((roomType) => (

                            <div
                                key={roomType.id}
                                className="frt-result"
                            >

                                <div className="frt-info">

                                    <h3 className="frt-name">
                                        {roomType.name}
                                    </h3>

                                    <p className="frt-type">
                                        Type: {roomType.type}
                                    </p>

                                    <p className="frt-bedroom">
                                        {roomType.bedroom} BHK
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="frt-select-button"
                                    onClick={() =>
                                        handleSelect(roomType)
                                    }
                                >
                                    Select
                                </button>

                            </div>

                        ))}

                    </div>
                )}


            {selectedRoomType && (
                <div className="frt-selected">

                    <div className="frt-selected-info">

                        <div className="frt-selected-label">
                            Selected Room Type
                        </div>

                        <h3 className="frt-name">
                            {selectedRoomType.name}
                        </h3>

                        <p className="frt-type">
                            Type: {selectedRoomType.type}
                        </p>

                        <p className="frt-bedroom">
                            {selectedRoomType.bedroom} BHK
                        </p>

                    </div>


                    <button
                        type="button"
                        className="frt-remove-button"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>

                </div>
            )}

        </div>
    );
};


export default FindRoomType;