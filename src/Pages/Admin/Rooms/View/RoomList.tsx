// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import Pagination from "../../../../Components/Pagination/Pagination";


// Step 2 — types

type HotelAdmin = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

type Property = {
    id: number;
    name: string;
};

type RoomType = {
    id: number;
    property_id: number;
    name: string;
    type: string;
    bedroom: number;
    max_occupancy: number;
    base_price: string;
    status: string;
};

type Room = {
    id: number;
    room_type_id: number;
    room_no: string;
    status: string;
    created_at: string;
    updated_at: string;
};


// Step 3 — component

const RoomList = () => {

    // Step 4 — state

    const [hotelAdmins, setHotelAdmins] =
        useState<HotelAdmin[]>([]);

    const [selectedHotelAdminId, setSelectedHotelAdminId] =
        useState<string>("");


    const [properties, setProperties] =
        useState<Property[]>([]);

    const [selectedPropertyId, setSelectedPropertyId] =
        useState<string>("");


    const [roomTypes, setRoomTypes] =
        useState<RoomType[]>([]);

    const [selectedRoomTypeId, setSelectedRoomTypeId] =
        useState<string>("");


    const [rooms, setRooms] =
        useState<Room[]>([]);

    const [currentPage, setCurrentPage] =
        useState<number>(1);

    const [lastPage, setLastPage] =
        useState<number>(1);


    const [editingRoomId, setEditingRoomId] =
        useState<number | null>(null);

    const [editRoomNo, setEditRoomNo] =
        useState<string>("");


    const [loading, setLoading] =
        useState(false);

    const [propertiesLoading, setPropertiesLoading] =
        useState(false);

    const [roomTypesLoading, setRoomTypesLoading] =
        useState(false);

    const [roomsLoading, setRoomsLoading] =
        useState(false);

    const [updatingRoom, setUpdatingRoom] =
        useState(false);


    const [error, setError] =
        useState("");

    const [propertiesError, setPropertiesError] =
        useState("");

    const [roomTypesError, setRoomTypesError] =
        useState("");

    const [roomsError, setRoomsError] =
        useState("");

    const [roomUpdateError, setRoomUpdateError] =
        useState("");


    // Step 5 — functions

    const fetchHotelAdmins = async () => {

        const response = await api.get(
            "/admin/hotel-admins/list"
        );

        setHotelAdmins(response.data.data);
    };


    const fetchProperties = async (
        hotelAdminId: string
    ) => {

        const response = await api.get(
            "/hotel/properties/options",
            {
                params: {
                    hotel_admin_id: hotelAdminId,
                },
            }
        );

        setProperties(response.data.data);
    };


    const fetchRoomTypes = async (
        propertyId: string
    ) => {

        const response = await api.get(
            "/admin/room-types/list",
            {
                params: {
                    property_id: propertyId,
            },
            }
        );

        setRoomTypes(response.data.data);
    };


    const fetchRooms = async (
        roomTypeId: string,
        page: number
    ) => {

        const response = await api.get(
            "/admin/rooms/list",
            {
                params: {
                    room_type_id: roomTypeId,
                    page: page,
                },
            }
        );

        setRooms(response.data.data.data);

        setCurrentPage(
            response.data.data.current_page
        );

        setLastPage(
            response.data.data.last_page
        );
    };


    const updateRoomNumber = async (
        roomId: number
    ) => {

        const room = rooms.find(
            (room) => room.id === roomId
        );

        if (!room) {
            return;
        }

        if (!editRoomNo.trim()) {
            setRoomUpdateError(
                "Room number is required."
            );

            return;
        }

        setUpdatingRoom(true);
        setRoomUpdateError("");

        try {

            const response = await api.patch(
                `/admin/rooms/${roomId}`,
                {
                    room_no: editRoomNo.trim(),
                }
            );

            const updatedRoom: Room = {
                ...room,
                ...response.data.data,
            };

            setRooms((currentRooms) =>
                currentRooms.map((currentRoom) =>
                    currentRoom.id === roomId
                        ? updatedRoom
                        : currentRoom
                )
            );

            setEditingRoomId(null);
            setEditRoomNo("");

        } catch (error: any) {

            setRoomUpdateError(
                error?.response?.data?.message ||
                "Failed to update room number."
            );

        } finally {

            setUpdatingRoom(false);
        }
    };


    // Step 6 — effects

    useEffect(() => {

        const loadHotelAdmins = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchHotelAdmins();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load hotel admins."
                );

            } finally {

                setLoading(false);
            }
        };

        loadHotelAdmins();

    }, []);


    // Step 7 — handlers

    const handleHotelAdminChange = async (
        value: string
    ) => {

        setSelectedHotelAdminId(value);

        setSelectedPropertyId("");
        setSelectedRoomTypeId("");

        setProperties([]);
        setRoomTypes([]);
        setRooms([]);

        setCurrentPage(1);
        setLastPage(1);

        setPropertiesError("");
        setRoomTypesError("");
        setRoomsError("");
        setRoomUpdateError("");

        setEditingRoomId(null);
        setEditRoomNo("");

        if (!value) {
            return;
        }

        setPropertiesLoading(true);

        try {

            await fetchProperties(value);

        } catch (error: any) {

            setProperties([]);

            setPropertiesError(
                error?.response?.data?.message ||
                "Failed to load properties."
            );

        } finally {

            setPropertiesLoading(false);
        }
    };


    const handlePropertyChange = async (
        value: string
    ) => {

        setSelectedPropertyId(value);

        setSelectedRoomTypeId("");

        setRoomTypes([]);
        setRooms([]);

        setCurrentPage(1);
        setLastPage(1);

        setRoomTypesError("");
        setRoomsError("");
        setRoomUpdateError("");

        setEditingRoomId(null);
        setEditRoomNo("");

        if (!value) {
            return;
        }

        setRoomTypesLoading(true);

        try {

            await fetchRoomTypes(value);

        } catch (error: any) {

            setRoomTypes([]);

            setRoomTypesError(
                error?.response?.data?.message ||
                "Failed to load room types."
            );

        } finally {

            setRoomTypesLoading(false);
        }
    };


    const handleRoomTypeChange = async (
        value: string
    ) => {

        setSelectedRoomTypeId(value);

        setRooms([]);

        setCurrentPage(1);
        setLastPage(1);

        setRoomsError("");
        setRoomUpdateError("");

        setEditingRoomId(null);
        setEditRoomNo("");

        if (!value) {
            return;
        }

        setRoomsLoading(true);

        try {

            await fetchRooms(value, 1);

        } catch (error: any) {

            setRooms([]);

            setRoomsError(
                error?.response?.data?.message ||
                "Failed to load rooms."
            );

        } finally {

            setRoomsLoading(false);
        }
    };


    const handlePageChange = async (
        page: number
    ) => {

        if (
            page < 1 ||
            page > lastPage ||
            !selectedRoomTypeId
        ) {
            return;
        }

        setRoomsLoading(true);
        setRoomsError("");
        setRoomUpdateError("");

        setEditingRoomId(null);
        setEditRoomNo("");

        try {

            await fetchRooms(
                selectedRoomTypeId,
                page
            );

        } catch (error: any) {

            setRoomsError(
                error?.response?.data?.message ||
                "Failed to load rooms."
            );

        } finally {

            setRoomsLoading(false);
        }
    };


    const handleEditRoom = (
        room: Room
    ) => {

        setEditingRoomId(room.id);
        setEditRoomNo(room.room_no);
        setRoomUpdateError("");
    };


    const handleCancelRoomEdit = () => {

        setEditingRoomId(null);
        setEditRoomNo("");
        setRoomUpdateError("");
    };


    // Step 8 — return()

    return (
        <div>

            <h1>
                Rooms
            </h1>


            {loading && (
                <p>
                    Loading hotel admins...
                </p>
            )}


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading && !error && (

                <>

                    <div>

                        <label>
                            Hotel Admin
                        </label>

                        <select
                            value={selectedHotelAdminId}
                            onChange={(e) =>
                                handleHotelAdminChange(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Hotel Admin
                            </option>

                            {hotelAdmins.map((admin) => (

                                <option
                                    key={admin.id}
                                    value={admin.id}
                                >
                                    {admin.name} - {admin.phone}
                                </option>

                            ))}

                        </select>

                    </div>


                    {propertiesLoading && (
                        <p>
                            Loading properties...
                        </p>
                    )}


                    {propertiesError && (
                        <p>
                            {propertiesError}
                        </p>
                    )}


                    {selectedHotelAdminId &&
                        !propertiesLoading &&
                        !propertiesError && (

                            <div>

                                <label>
                                    Property
                                </label>

                                <select
                                    value={selectedPropertyId}
                                    onChange={(e) =>
                                        handlePropertyChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Property
                                    </option>

                                    {properties.map((property) => (

                                        <option
                                            key={property.id}
                                            value={property.id}
                                        >
                                            {property.name}
                                        </option>

                                    ))}

                                </select>

                            </div>
                        )}


                    {roomTypesLoading && (
                        <p>
                            Loading room types...
                        </p>
                    )}


                    {roomTypesError && (
                        <p>
                            {roomTypesError}
                        </p>
                    )}


                    {selectedPropertyId &&
                        !roomTypesLoading &&
                        !roomTypesError && (

                            <div>

                                <label>
                                    Room Type
                                </label>

                                <select
                                    value={selectedRoomTypeId}
                                    onChange={(e) =>
                                        handleRoomTypeChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Room Type
                                    </option>

                                    {roomTypes.map((roomType) => (

                                        <option
                                            key={roomType.id}
                                            value={roomType.id}
                                        >
                                            {roomType.name}
                                        </option>

                                    ))}

                                </select>

                            </div>
                        )}


                    {roomsLoading && (
                        <p>
                            Loading rooms...
                        </p>
                    )}


                    {roomsError && (
                        <p>
                            {roomsError}
                        </p>
                    )}


                    {roomUpdateError && (
                        <p>
                            {roomUpdateError}
                        </p>
                    )}


                    {!roomsLoading &&
                        !roomsError &&
                        selectedRoomTypeId &&
                        rooms.length > 0 && (

                            <>

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Room No
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Created At
                                            </th>

                                            <th>
                                                Updated At
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {rooms.map((room) => (

                                            <tr
                                                key={room.id}
                                            >

                                                <td>

                                                    {editingRoomId === room.id ? (

                                                        <input
                                                            type="text"
                                                            value={editRoomNo}
                                                            onChange={(e) =>
                                                                setEditRoomNo(
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                updatingRoom
                                                            }
                                                        />

                                                    ) : (

                                                        room.room_no

                                                    )}

                                                </td>


                                                <td>
                                                    {room.status}
                                                </td>


                                                <td>
                                                    {room.created_at}
                                                </td>


                                                <td>
                                                    {room.updated_at}
                                                </td>


                                                <td>

                                                    {editingRoomId === room.id ? (

                                                        <>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateRoomNumber(
                                                                        room.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingRoom
                                                                }
                                                            >
                                                                {updatingRoom
                                                                    ? "Saving..."
                                                                    : "Save"}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    handleCancelRoomEdit
                                                                }
                                                                disabled={
                                                                    updatingRoom
                                                                }
                                                            >
                                                                Cancel
                                                            </button>

                                                        </>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditRoom(
                                                                    room
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>


                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={lastPage}
                                    onPageChange={
                                        handlePageChange
                                    }
                                />

                            </>
                        )}


                    {!roomsLoading &&
                        !roomsError &&
                        selectedRoomTypeId &&
                        rooms.length === 0 && (

                            <p>
                                No rooms found for this room type.
                            </p>
                        )}

                </>

            )}

        </div>
    );
};


export default RoomList;