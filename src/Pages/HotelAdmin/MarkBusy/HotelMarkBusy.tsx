import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Axios from '../../../api/axios';
import { Building2, BedDouble, DoorOpen, Calendar, List, CheckCircle, Edit2, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import './HotelMarkBusy.css';

type Property = {
    id: number;
    name: string;
    type: string;
    status: string;
    city?: {
        id: number;
        name: string;
    };
};

type RoomType = {
    id: number;
    name: string;
    type: string;
    base_price: string;
    status: string;
};

type Room = {
    id: number;
    room_no: string;
    status: string;
};

const REASON_OPTIONS = [
    'Maintenance',
    'Deep Cleaning',
    'Reserved',
    'Under Renovation',
    'Other'
];

const HotelMarkBusy = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    // State Management
    const [step, setStep] = useState<number>(1);

    // Step 1: Property
    const [properties, setProperties] = useState<Property[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    // Step 2: Room Type
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);

    // Step 3: Room
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Step 4: Dates & Reason
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [note, setNote] = useState<string>('');
    
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user?.role === 'hotel_admin') {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        try {
            setLoadingProperties(true);
            const response = await Axios.get('/hotel/mark-busy/my-properties');
            if (response.data.status) {
                setProperties(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load your properties.');
        } finally {
            setLoadingProperties(false);
        }
    };

    const fetchRoomTypes = async (propertyId: number) => {
        try {
            setLoadingRoomTypes(true);
            const response = await Axios.get(`/hotel/mark-busy/properties/${propertyId}/room-types`);
            if (response.data.status) {
                setRoomTypes(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load room types.');
        } finally {
            setLoadingRoomTypes(false);
        }
    };

    const fetchRooms = async (roomTypeId: number) => {
        try {
            setLoadingRooms(true);
            const response = await Axios.get(`/hotel/mark-busy/room-types/${roomTypeId}/rooms`);
            if (response.data.status) {
                setRooms(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load rooms.');
        } finally {
            setLoadingRooms(false);
        }
    };

    // Navigation and Reset logic
    const handleEditStep = (targetStep: number) => {
        setStep(targetStep);
        
        if (targetStep <= 1) {
            setSelectedProperty(null);
            setSelectedRoomType(null);
            setSelectedRoom(null);
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        } else if (targetStep <= 2) {
            setSelectedRoomType(null);
            setSelectedRoom(null);
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        } else if (targetStep <= 3) {
            setSelectedRoom(null);
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        } else if (targetStep <= 4) {
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        }
    };

    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
        setStep(2);
        fetchRoomTypes(property.id);
    };

    const handleRoomTypeSelect = (roomType: RoomType) => {
        setSelectedRoomType(roomType);
        setStep(3);
        fetchRooms(roomType.id);
    };

    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        setStep(4);
    };

    const handleDateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.error('Please select both start and end dates.');
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            toast.error('End date cannot be before start date.');
            return;
        }
        setStep(5);
    };

    const handleReasonSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error('Please select a reason.');
            return;
        }
        if (reason === 'Other' && !note.trim()) {
            toast.error('Please provide a note for Other reason.');
            return;
        }
        setStep(6);
    };

    const submitBusySchedule = async () => {
        if (!selectedRoom || !startDate || !endDate || !reason) return;

        try {
            setSubmitting(true);
            const response = await Axios.post('/hotel/room-busy-schedules', {
                room_id: selectedRoom.id,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
                note: reason === 'Other' ? note : null
            });

            if (response.data.status) {
                toast.success(response.data.message || 'Room successfully marked as busy.');
                handleEditStep(1); // Reset to beginning
            } else {
                toast.error(response.data.message || 'Failed to submit.');
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<{ message?: string; errors?: any }>;
            if (axiosError.response?.data?.message) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error('Failed to submit. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Helper for today's date format (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    if (user?.role !== 'hotel_admin') {
        return (
            <div className="hmb-page">
                <div className="hmb-empty" style={{ marginTop: '40px' }}>
                    <Info className="hmb-empty-icon" />
                    <p>Access unavailable. Only Hotel Admins can view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="hmb-page">
            <header className="hmb-header">
                <p className="hmb-eyebrow">Inventory Management</p>
                <h1 className="hmb-title">Mark Room Busy</h1>
                <p className="hmb-subtitle">Welcome, {user?.name || 'Hotel Admin'}. Manage your room availability schedules here.</p>
            </header>

            {/* PROGRESSIVE SUMMARY BAR */}
            <div className="hmb-summaries">
                {step > 1 && selectedProperty && (
                    <div className="hmb-summary hmb-summary--property hmb-fade-in">
                        <div className="hmb-summary-copy">
                            <Building2 className="hmb-summary-icon" />
                            <div>
                                <p className="hmb-summary-label">Selected Property</p>
                                <p className="hmb-summary-value">{selectedProperty.name}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(1)} className="hmb-summary-action">
                            <Edit2 className="hmb-action-icon" /> Change
                        </button>
                    </div>
                )}

                {step > 2 && selectedRoomType && (
                    <div className="hmb-summary hmb-summary--roomtype hmb-fade-in">
                        <div className="hmb-summary-copy">
                            <BedDouble className="hmb-summary-icon" />
                            <div>
                                <p className="hmb-summary-label">Selected Room Type</p>
                                <p className="hmb-summary-value">{selectedRoomType.name}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(2)} className="hmb-summary-action">
                            <Edit2 className="hmb-action-icon" /> Change
                        </button>
                    </div>
                )}

                {step > 3 && selectedRoom && (
                    <div className="hmb-summary hmb-summary--room hmb-fade-in">
                        <div className="hmb-summary-copy">
                            <DoorOpen className="hmb-summary-icon" />
                            <div>
                                <p className="hmb-summary-label">Selected Room</p>
                                <p className="hmb-summary-value">Room {selectedRoom.room_no}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(3)} className="hmb-summary-action">
                            <Edit2 className="hmb-action-icon" /> Change
                        </button>
                    </div>
                )}

                {step > 4 && startDate && endDate && (
                    <div className="hmb-summary hmb-summary--dates hmb-fade-in">
                        <div className="hmb-summary-copy">
                            <Calendar className="hmb-summary-icon" />
                            <div>
                                <p className="hmb-summary-label">Busy Duration</p>
                                <p className="hmb-summary-value">{startDate} to {endDate}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(4)} className="hmb-summary-action">
                            <Edit2 className="hmb-action-icon" /> Edit
                        </button>
                    </div>
                )}

                {step > 5 && reason && (
                    <div className="hmb-summary hmb-summary--reason hmb-fade-in">
                        <div className="hmb-summary-copy">
                            <List className="hmb-summary-icon" />
                            <div>
                                <p className="hmb-summary-label">Reason</p>
                                <p className="hmb-summary-value">{reason} {reason === 'Other' && `- ${note}`}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(5)} className="hmb-summary-action">
                            <Edit2 className="hmb-action-icon" /> Edit
                        </button>
                    </div>
                )}
            </div>

            {/* ACTIVE WIZARD STEP */}
            <div className="hmb-card">
                
                {/* Step 1: Property Selection */}
                {step === 1 && (
                    <div className="hmb-panel">
                        <h2 className="hmb-step-title">
                            <span className="hmb-step-number">1</span>
                            Select a Property
                        </h2>

                        {loadingProperties ? (
                            <div className="hmb-loading">
                                <Loader2 className="hmb-spin" /> Loading properties...
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="hmb-empty">
                                <Info className="hmb-empty-icon" />
                                <p>You don't have any properties.</p>
                            </div>
                        ) : (
                            <div className="hmb-grid">
                                {properties.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handlePropertySelect(p)}
                                        className="hmb-item"
                                    >
                                        <div className="hmb-item-row">
                                            <div className="hmb-item-copy">
                                                <p className="hmb-item-name">{p.name}</p>
                                                <p className="hmb-item-meta">{p.type} {p.city ? `· ${p.city.name}` : ''}</p>
                                            </div>
                                            <span className={`hmb-item-badge hmb-item-badge--${p.status === 'active' ? 'maintenance' : 'inactive'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Room Type Selection */}
                {step === 2 && (
                    <div className="hmb-panel">
                        <h2 className="hmb-step-title">
                            <span className="hmb-step-number">2</span>
                            Select a Room Type
                        </h2>

                        {loadingRoomTypes ? (
                            <div className="hmb-loading">
                                <Loader2 className="hmb-spin" /> Loading room types...
                            </div>
                        ) : roomTypes.length === 0 ? (
                            <div className="hmb-empty">
                                <Info className="hmb-empty-icon" />
                                <p>No room types found for this property.</p>
                            </div>
                        ) : (
                            <div className="hmb-grid">
                                {roomTypes.map((rt) => (
                                    <button
                                        key={rt.id}
                                        onClick={() => handleRoomTypeSelect(rt)}
                                        className="hmb-item"
                                    >
                                        <div className="hmb-item-row">
                                            <div className="hmb-item-copy">
                                                <p className="hmb-item-name">{rt.name}</p>
                                                <p className="hmb-item-meta">{rt.type}</p>
                                            </div>
                                            <span className={`hmb-item-badge hmb-item-badge--${rt.status === 'active' ? 'maintenance' : 'inactive'}`}>
                                                {rt.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Room Selection */}
                {step === 3 && (
                    <div className="hmb-panel">
                        <h2 className="hmb-step-title">
                            <span className="hmb-step-number">3</span>
                            Select a Room
                        </h2>

                        {loadingRooms ? (
                            <div className="hmb-loading">
                                <Loader2 className="hmb-spin" /> Loading rooms...
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="hmb-empty">
                                <Info className="hmb-empty-icon" />
                                <p>No rooms found for this room type.</p>
                            </div>
                        ) : (
                            <div className="hmb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                {rooms.map((room) => (
                                    <button
                                        key={room.id}
                                        onClick={() => handleRoomSelect(room)}
                                        className="hmb-item"
                                    >
                                        <div className="hmb-item-row">
                                            <div className="hmb-item-copy">
                                                <p className="hmb-item-name">Room {room.room_no}</p>
                                            </div>
                                            <span className={`hmb-item-badge hmb-item-badge--${room.status === 'maintenance' ? 'maintenance' : room.status === 'inactive' ? 'inactive' : 'active'}`}>
                                                {room.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Date Selection */}
                {step === 4 && (
                    <div className="hmb-panel">
                        <h2 className="hmb-step-title">
                            <span className="hmb-step-number">4</span>
                            Select Date Range
                        </h2>
                        <form onSubmit={handleDateSubmit}>
                            <div className="hmb-form-grid">
                                <div className="hmb-field">
                                    <label className="hmb-label">Start Date</label>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            // Auto-adjust end date if needed
                                            if (endDate && new Date(e.target.value) > new Date(endDate)) {
                                                setEndDate('');
                                            }
                                        }}
                                        className="hmb-control"
                                        required
                                    />
                                </div>
                                <div className="hmb-field">
                                    <label className="hmb-label">End Date</label>
                                    <input
                                        type="date"
                                        min={startDate || todayStr}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="hmb-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="hmb-actions">
                                <button type="submit" className="hmb-button">
                                    Confirm Dates
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 5: Reason Selection */}
                {step === 5 && (
                    <div className="hmb-panel">
                        <h2 className="hmb-step-title">
                            <span className="hmb-step-number">5</span>
                            Provide a Reason
                        </h2>
                        <form onSubmit={handleReasonSubmit}>
                            <div className="hmb-form-stack">
                                <div className="hmb-field">
                                    <label className="hmb-label">Reason for Unavailability</label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="hmb-control"
                                        required
                                    >
                                        <option value="" disabled>Select a reason...</option>
                                        {REASON_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {reason === 'Other' && (
                                    <div className="hmb-field hmb-fade-in">
                                        <label className="hmb-label">Please explain (Required)</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            rows={3}
                                            className="hmb-control hmb-textarea"
                                            placeholder="Enter detailed reason..."
                                            required
                                        ></textarea>
                                    </div>
                                )}
                            </div>
                            <div className="hmb-actions">
                                <button type="submit" className="hmb-button">
                                    Confirm Reason
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 6: Final Confirmation */}
                {step === 6 && (
                    <div className="hmb-confirm">
                        <div className="hmb-confirm-icon">
                            <CheckCircle />
                        </div>
                        <h2 className="hmb-confirm-title">Ready to Submit</h2>
                        <p className="hmb-confirm-copy">
                            Please review the summary above. If everything is correct, click the button below to lock in the busy schedule.
                        </p>

                        <button
                            onClick={submitBusySchedule}
                            disabled={submitting}
                            className="hmb-button hmb-button--confirm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="hmb-spin" /> Marking Busy...
                                </>
                            ) : (
                                'Mark Room as Busy'
                            )}
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default HotelMarkBusy;
