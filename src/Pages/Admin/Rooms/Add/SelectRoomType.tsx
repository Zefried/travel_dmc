// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import '../Styles/SelectRoomType.css';


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


type SelectRoomTypeProps = {
    selectedRoomType: RoomType | null;
    onSelect: (roomType: RoomType) => void;
    onRemove: () => void;
};


const SelectRoomType = ({
    selectedRoomType,
    onSelect,
    onRemove,
}: SelectRoomTypeProps) => {

    // Step 2 — state

    const [searchQuery, setSearchQuery] = useState("");
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const searchRoomTypes = async (query: string) => {

        const response = await api.get(
            `/admin/room-types/for-rooms?query=${encodeURIComponent(query)}`
        );

        setRoomTypes(response.data.data);
    };


    useEffect(() => {

        const query = searchQuery.trim();

        if (query.length < 3) {

            setRoomTypes([]);
            setError("");

            return;
        }

        const timer = setTimeout(async () => {

            setLoading(true);
            setError("");

            try {

                await searchRoomTypes(query);

            } catch (error: any) {

                setRoomTypes([]);

                setError(
                    error?.response?.data?.message ||
                    "Failed to search room types."
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
        roomType: RoomType
    ) => {

        setSearchQuery("");
        setRoomTypes([]);
        setError("");

        onSelect(roomType);
    };


    const handleRemove = () => {

        setSearchQuery("");
        setRoomTypes([]);
        setError("");

        onRemove();
    };


    // Step 5 — return()

    return (
        <div className="srt-container">

            <div className="srt-header">

                <h2 className="srt-title">
                    Select Room Type
                </h2>

                <p className="srt-subtitle">
                    Search by room type or property name.
                </p>

            </div>


            <div className="srt-search">

                <input
                    id="srt-search"
                    type="text"
                    className="srt-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search room type or property"
                />

            </div>


            {loading && (
                <div className="srt-loading">
                    Searching...
                </div>
            )}


            {error && (
                <div className="srt-error">
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                roomTypes.length === 0 &&
                searchQuery.trim().length >= 3 && (
                    <div className="srt-empty">
                        No room types found.
                    </div>
                )}


            {roomTypes.length > 0 && (
                <div className="srt-results">

                    {roomTypes.map((roomType) => (

                        <div
                            key={roomType.id}
                            className="srt-result"
                        >

                            <div className="srt-info">

                                <h3 className="srt-name">
                                    {roomType.name}
                                </h3>

                                <p className="srt-type">
                                    Type: {roomType.type}
                                </p>

                                <p className="srt-bedroom">
                                    {roomType.bedroom} BHK
                                </p>

                                <p className="srt-property">
                                    Property:{" "}
                                    {roomType.property.name}
                                </p>

                                <p className="srt-location">
                                    {roomType.property.country.name},{" "}
                                    {roomType.property.city.name}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="srt-select-button"
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
                <div className="srt-selected">

                    <div className="srt-selected-info">

                        <div className="srt-selected-label">
                            Selected Room Type
                        </div>

                        <h3 className="srt-name">
                            {selectedRoomType.name}
                        </h3>

                        <p className="srt-type">
                            Type: {selectedRoomType.type}
                        </p>

                        <p className="srt-bedroom">
                            {selectedRoomType.bedroom} BHK
                        </p>

                        <p className="srt-property">
                            Property:{" "}
                            {selectedRoomType.property.name}
                        </p>

                        <p className="srt-location">
                            {selectedRoomType.property.country.name},{" "}
                            {selectedRoomType.property.city.name}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="srt-remove-button"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>

                </div>
            )}

        </div>
    );
};


export default SelectRoomType;