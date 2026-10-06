import React, { useState, useEffect } from 'react';
import Axios from '../../../../api/axios';
import toast from 'react-hot-toast';
import { CalendarDays, DoorOpen, LoaderCircle, Info, Building, MapPin, User, Bed } from 'lucide-react';
import './RoomAvailability.css';

type Option = { id: number; name: string };
type UserOption = { id: number; name: string; phone: string; email: string };
type RoomTypeOption = { id: number; name: string; type: string };

type BusySchedule = {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    note: string | null;
};

type Room = {
    id: number;
    room_no: string;
    busy_schedules: BusySchedule[];
};

const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.slice(0, 10).split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
        .format(new Date(Date.UTC(year, month - 1, day)));
};

const RoomAvailability = () => {
    const [states, setStates] = useState<Option[]>([]);
    const [hotelAdmins, setHotelAdmins] = useState<UserOption[]>([]);
    const [properties, setProperties] = useState<Option[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(false);

    useEffect(() => {
        fetchStates();
        fetchAdmins('');
    }, []);

    const fetchStates = async () => {
        try {
            setLoadingStates(true);
            const res = await Axios.get('/admin/states/options');
            if (res.data.status) setStates(res.data.data);
        } catch (error) {
            toast.error('Failed to load states');
        } finally {
            setLoadingStates(false);
        }
    };

    const fetchAdmins = async (stateId: string) => {
        try {
            setLoadingAdmins(true);
            const url = stateId ? `/admin/hotel-admins/list?state_id=${stateId}` : '/admin/hotel-admins/list';
            const res = await Axios.get(url);
            if (res.data.status) setHotelAdmins(res.data.data);
        } catch (error) {
            toast.error('Failed to load hotel admins');
        } finally {
            setLoadingAdmins(false);
        }
    };

    const fetchProperties = async (adminId: string) => {
        if (!adminId) {
            setProperties([]);
            return;
        }
        try {
            setLoadingProperties(true);
            const res = await Axios.get(`/admin/properties/options?hotel_admin_id=${adminId}`);
            if (res.data.status) setProperties(res.data.data);
        } catch (error) {
            toast.error('Failed to load properties');
        } finally {
            setLoadingProperties(false);
        }
    };

    const fetchRoomTypes = async (propertyId: string) => {
        if (!propertyId) {
            setRoomTypes([]);
            return;
        }
        try {
            setLoadingRoomTypes(true);
            const res = await Axios.get(`/admin/room-types/list?property_id=${propertyId}`);
            if (res.data.status) setRoomTypes(res.data.data);
        } catch (error) {
            toast.error('Failed to load room types');
        } finally {
            setLoadingRoomTypes(false);
        }
    };

    const fetchRooms = async (roomTypeId: string) => {
        if (!roomTypeId) {
            setRooms([]);
            return;
        }
        try {
            setLoadingRooms(true);
            const res = await Axios.get(`/admin/rooms/availability?room_type_id=${roomTypeId}`);
            if (res.data.status) setRooms(res.data.data);
        } catch (error) {
            toast.error('Failed to load rooms');
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateId = e.target.value;
        setSelectedState(stateId);
        setSelectedAdmin('');
        setSelectedProperty('');
        setSelectedRoomType('');
        setProperties([]);
        setRoomTypes([]);
        setRooms([]);
        fetchAdmins(stateId);
    };

    const handleAdminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const adminId = e.target.value;
        setSelectedAdmin(adminId);
        setSelectedProperty('');
        setSelectedRoomType('');
        setRoomTypes([]);
        setRooms([]);
        fetchProperties(adminId);
    };

    const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const propId = e.target.value;
        setSelectedProperty(propId);
        setSelectedRoomType('');
        setRooms([]);
        fetchRoomTypes(propId);
    };

    const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const rtId = e.target.value;
        setSelectedRoomType(rtId);
        fetchRooms(rtId);
    };

    return (
        <main className="room-avail-page">
            <header className="room-avail-header">
                <p className="room-avail-eyebrow">Inventory Management</p>
                <h1 className="room-avail-title">View Room Availability</h1>
                <p className="room-avail-subtitle">Check current and upcoming busy periods for any room.</p>
            </header>

            <section className="room-avail-filters">
                <label className="room-avail-field">
                    <span><MapPin size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> State (Optional)</span>
                    <select value={selectedState} onChange={handleStateChange} disabled={loadingStates}>
                        <option value="">All States</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </label>

                <label className="room-avail-field">
                    <span><User size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Hotel Admin</span>
                    <select value={selectedAdmin} onChange={handleAdminChange} disabled={loadingAdmins}>
                        <option value="">Select Admin</option>
                        {hotelAdmins.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                    </select>
                </label>

                <label className="room-avail-field">
                    <span><Building size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Property</span>
                    <select value={selectedProperty} onChange={handlePropertyChange} disabled={!selectedAdmin || loadingProperties}>
                        <option value="">Select Property</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </label>

                <label className="room-avail-field">
                    <span><Bed size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Room Type</span>
                    <select value={selectedRoomType} onChange={handleRoomTypeChange} disabled={!selectedProperty || loadingRoomTypes}>
                        <option value="">Select Room Type</option>
                        {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                    </select>
                </label>
            </section>

            <section aria-live="polite">
                {loadingRooms ? (
                    <div className="room-avail-state">
                        <LoaderCircle className="room-avail-spinner" size={32} />
                        <span>Loading rooms...</span>
                    </div>
                ) : selectedRoomType && rooms.length === 0 ? (
                    <div className="room-avail-empty">
                        <DoorOpen className="room-avail-empty-icon" />
                        <h2>No rooms found</h2>
                        <p>There are no rooms associated with this room type.</p>
                    </div>
                ) : selectedRoomType && rooms.length > 0 ? (
                    <div className="room-avail-list">
                        {rooms.map(room => (
                            <article key={room.id} className="room-avail-card">
                                <div className="room-avail-card-head">
                                    <h3 className="room-avail-room-no"><DoorOpen size={20} /> Room {room.room_no}</h3>
                                    <span className={`room-avail-status ${(room.busy_schedules || []).filter(s => s.start_date.slice(0,10) <= new Date().toISOString().slice(0, 10) && s.end_date.slice(0,10) >= new Date().toISOString().slice(0, 10)).length > 0 ? 'room-avail-status--busy' : 'room-avail-status--available'}`}>
                                        {(room.busy_schedules || []).filter(s => s.start_date.slice(0,10) <= new Date().toISOString().slice(0, 10) && s.end_date.slice(0,10) >= new Date().toISOString().slice(0, 10)).length > 0 ? 'Busy Now' : 'Available'}
                                    </span>
                                </div>

                                {(() => {
                                    const today = new Date().toISOString().slice(0, 10);
                                    const schedules = room.busy_schedules || [];
                                    const currentSchedules = schedules.filter(s => s.start_date.slice(0, 10) <= today && s.end_date.slice(0, 10) >= today);
                                    const upcomingSchedules = schedules.filter(s => s.start_date.slice(0, 10) > today);

                                    return (
                                        <>
                                            {currentSchedules.map(schedule => (
                                                <div key={schedule.id} className="room-avail-schedule">
                                                    <span className="room-avail-schedule-label">Current</span>
                                                    <div className="room-avail-dates">
                                                        <CalendarDays size={16} />
                                                        {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                                                    </div>
                                                    <div className="room-avail-reason">
                                                        <Info size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> {schedule.reason}
                                                    </div>
                                                </div>
                                            ))}

                                            {upcomingSchedules.length > 0 && (
                                                <div className="room-avail-schedule">
                                                    <span className="room-avail-schedule-label">Upcoming</span>
                                                    {upcomingSchedules.map(schedule => (
                                                        <div key={schedule.id} style={{ marginBottom: '0.5rem' }}>
                                                            <div className="room-avail-dates">
                                                                <CalendarDays size={16} />
                                                                {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                                                            </div>
                                                            <div className="room-avail-reason" style={{marginTop:'4px'}}>
                                                                <Info size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> {schedule.reason}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="room-avail-empty">
                        <Info className="room-avail-empty-icon" />
                        <h2>Select a room type</h2>
                        <p>Please select a hotel admin, property, and room type to view availability.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default RoomAvailability;
