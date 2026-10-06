import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { useItinerary } from "../../../Context/ItineraryContext";

type RoomType = {
    id: number;
    name: string;
    base_price: number;
};

type BusySchedule = {
    start_date: string;
    end_date: string;
};

type Room = {
    id: number;
    room_no: string;
    busy_schedules: BusySchedule[];
    roomTypeId: number;
    roomTypeName: string;
    basePrice: number;
};

const RoomSelection = () => {
    const { state, setRoom } = useItinerary();
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            if (!state.hotel || !state.leavingOn) return;

            try {
                setLoading(true);

                // 1. Fetch room types for the property
                const rtRes = await api.get(`/admin/room-types/list?property_id=${state.hotel.id}`);
                if (!rtRes.data?.status) throw new Error("Failed to load room types");

                const roomTypes: RoomType[] = rtRes.data.data;

                // 2. Fetch rooms for all room types
                const roomsPromises = roomTypes.map(rt => 
                    api.get(`/admin/rooms/availability?room_type_id=${rt.id}`)
                );
                
                const roomsResponses = await Promise.all(roomsPromises);
                
                let allRooms: Room[] = [];
                
                roomsResponses.forEach((res, index) => {
                    if (res.data?.status) {
                        const rt = roomTypes[index];
                        const fetchedRooms = res.data.data.map((r: any) => ({
                            id: r.id,
                            room_no: r.room_no,
                            busy_schedules: r.busy_schedules || [],
                            roomTypeId: rt.id,
                            roomTypeName: rt.name,
                            basePrice: rt.base_price || 0
                        }));
                        allRooms = [...allRooms, ...fetchedRooms];
                    }
                });

                // 3. Check availability
                const tripStartDate = new Date(state.leavingOn);
                const tripEndDate = new Date(state.leavingOn);
                tripEndDate.setDate(tripStartDate.getDate() + state.nights);
                
                // Keep time portion at midnight
                tripStartDate.setHours(0, 0, 0, 0);
                tripEndDate.setHours(0, 0, 0, 0);

                const freeRooms = allRooms.filter(room => {
                    // Check if any schedule overlaps with trip dates
                    const hasOverlap = room.busy_schedules.some(schedule => {
                        const scheduleStart = new Date(schedule.start_date.slice(0, 10));
                        const scheduleEnd = new Date(schedule.end_date.slice(0, 10));
                        
                        scheduleStart.setHours(0, 0, 0, 0);
                        scheduleEnd.setHours(0, 0, 0, 0);

                        // Overlap condition: schedule_start < trip_end AND schedule_end > trip_start
                        return scheduleStart < tripEndDate && scheduleEnd > tripStartDate;
                    });
                    
                    return !hasOverlap;
                });

                setAvailableRooms(freeRooms);

            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableRooms();
    }, [state.hotel, state.leavingOn, state.nights]);

    const handleSelectRoom = (room: Room) => {
        setRoom({
            roomTypeId: room.roomTypeId,
            roomId: room.id,
            roomName: `${room.roomTypeName} - Room ${room.room_no}`,
            pricePerNight: room.basePrice
        });
    };

    if (loading) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Checking availability...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                <p>{error}</p>
            </div>
        );
    }

    if (availableRooms.length === 0) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No rooms available for the selected dates.</p>
                <button
                    type="button"
                    className="agentsearch-save-button"
                    style={{ width: 'auto', marginTop: '1rem' }}
                    onClick={() => setRoom(null)}
                >
                    Try different dates or hotel
                </button>
            </div>
        );
    }

    const availableRoomTypes = availableRooms.reduce((acc, room) => {
        if (!acc[room.roomTypeId]) {
            acc[room.roomTypeId] = room;
        }
        return acc;
    }, {} as Record<number, Room>);

    const roomTypeCards = Object.values(availableRoomTypes);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="agentsearch-card-heading" style={{ marginBottom: '1rem' }}>
                <div>
                    <span className="agentsearch-card-label">ROOM SELECTION</span>
                    <h2>Available Rooms</h2>
                </div>
            </div>

            {roomTypeCards.map(room => (
                <div key={room.id} className="agentsearch-hotel-card">
                    <div className="agentsearch-hotel-image">
                        <div className="agentsearch-hotel-placeholder" style={{ backgroundColor: '#2c3e50' }}>ROOM</div>
                    </div>

                    <div className="agentsearch-hotel-content">
                        <h3>{room.roomTypeName}</h3>

                        <p className="agentsearch-hotel-address">
                            Room {room.room_no} available
                        </p>

                        <div className="agentsearch-hotel-score">
                            <strong>₹{room.basePrice}</strong>
                            <div>
                                <span>per night</span>
                            </div>
                        </div>

                        <div className="agentsearch-hotel-features">
                            <p>✓ Available for your dates</p>
                        </div>

                        <button
                            type="button"
                            className="agentsearch-save-button"
                            style={{ width: 'auto', marginTop: '1rem' }}
                            onClick={() => handleSelectRoom(room)}
                        >
                            Select Room
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoomSelection;
