import React, { useState, useEffect } from 'react';
import Axios from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Calendar, Car, AlertCircle, CheckCircle, Search, User, X } from 'lucide-react';
import './RequestVehicleBooking.css';

interface Owner {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface OverlappingSchedule {
    start_date: string;
    end_date: string;
    reason: string;
}

interface Vehicle {
    id: number;
    name: string;
    model: string;
    registration_no: string;
    type: string;
    seating_capacity: number;
    vehicle_admin: {
        id: number;
        name: string;
    };
    is_available: boolean;
    overlapping_schedules?: OverlappingSchedule[];
}

const RequestVehicleBooking = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ownerId, setOwnerId] = useState<string>('');
    const [owners, setOwners] = useState<Owner[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Modal state
    const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
    const [passengerCount, setPassengerCount] = useState<string>('');
    const [requestedPrice, setRequestedPrice] = useState<string>('');
    const [bookingNote, setBookingNote] = useState<string>('');
    const [submittingBooking, setSubmittingBooking] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await Axios.get('/admin/vehicle-admins/list');
                if (response.data.status) {
                    setOwners(response.data.data);
                }
            } catch (error) {
                console.error('Failed to load owners');
            }
        };
        fetchOwners();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            checkAvailability();
        } else {
            setVehicles([]);
            setSearched(false);
        }
    }, [startDate, endDate, ownerId]);

    const checkAvailability = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const params: any = {
                start_date: startDate,
                end_date: endDate,
            };
            if (ownerId) {
                params.vehicle_admin_id = ownerId;
            }

            const response = await Axios.get('/admin/vehicles/availability', { params });
            if (response.data.status) {
                setVehicles(response.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to check availability');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenBookingModal = (vehicle: Vehicle) => {
        setSelectedVehicleForBooking(vehicle);
        setPassengerCount('');
        setRequestedPrice('');
        setBookingNote('');
    };

    const handleCloseBookingModal = () => {
        setSelectedVehicleForBooking(null);
    };

    const submitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicleForBooking) return;

        setSubmittingBooking(true);
        try {
            const payload = {
                vehicle_id: selectedVehicleForBooking.id,
                start_date: startDate,
                end_date: endDate,
                passenger_count: parseInt(passengerCount),
                requested_price: requestedPrice ? parseFloat(requestedPrice) : null,
                note: bookingNote
            };

            const response = await Axios.post('/admin/vehicles/booking-requests', payload);
            
            if (response.data.status) {
                toast.success(response.data.message || 'Booking request submitted successfully.');
                alert(response.data.message || 'Booking request submitted successfully.');
                handleCloseBookingModal();
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.data?.message) {
                toast.error(axiosError.response.data.message);
                alert(axiosError.response.data.message);
            } else {
                toast.error('Failed to submit booking request.');
                alert('Failed to submit booking request.');
            }
        } finally {
            setSubmittingBooking(false);
        }
    };

    return (
        <div className="req-book">
            <div className="req-book__header">
                <h1 className="req-book__title">
                    <Car className="req-book__title-icon" />
                    Request Vehicle Booking
                </h1>
                <p className="req-book__subtitle">Check availability of vehicles based on specific dates and request a booking.</p>
            </div>

            {!selectedVehicleForBooking ? (
                <>
                    {/* Filter Section */}
                    <div className="req-book__filters-panel">
                        <div className="req-book__filters-grid">
                            <div className="req-book__field">
                                <label className="req-book__label">
                                    <Calendar className="req-book__label-icon" />
                                    Start Date <span className="req-book__required">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="req-book__input"
                                />
                            </div>
                            <div className="req-book__field">
                                <label className="req-book__label">
                                    <Calendar className="req-book__label-icon" />
                                    End Date <span className="req-book__required">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="req-book__input"
                                />
                            </div>
                            <div className="req-book__field">
                                <label className="req-book__label">
                                    <User className="req-book__label-icon" />
                                    Vehicle Owner
                                </label>
                                <select
                                    value={ownerId}
                                    onChange={(e) => setOwnerId(e.target.value)}
                                    className="req-book__input"
                                >
                                    <option value="">All Owners</option>
                                    {owners.map(owner => (
                                        <option key={owner.id} value={owner.id}>
                                            {owner.name} ({owner.phone})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {searched && (
                        <div className="req-book__results-panel">
                            <div className="req-book__results-header">
                                <h2 className="req-book__results-title">
                                    <Search className="req-book__results-icon" />
                                    Availability Results
                                </h2>
                                {loading && (
                                    <div className="req-book__loading-inline">
                                        <div className="req-book__spinner-small"></div>
                                        Checking...
                                    </div>
                                )}
                            </div>

                            <div className="req-book__table-wrap">
                                <table className="req-book__table">
                                    <thead>
                                        <tr className="req-book__row-head">
                                            <th className="req-book__th">Vehicle Info</th>
                                            <th className="req-book__th">Type & Capacity</th>
                                            <th className="req-book__th">Owner</th>
                                            <th className="req-book__th">Availability Status</th>
                                            <th className="req-book__th req-book__th--right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={5} className="req-book__empty">
                                                    No vehicles found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                        {vehicles.map(vehicle => (
                                            <tr key={vehicle.id} className="req-book__row">
                                                <td className="req-book__td">
                                                    <div className="req-book__vehicle-name">{vehicle.name} ({vehicle.model})</div>
                                                    <div className="req-book__vehicle-reg">{vehicle.registration_no}</div>
                                                </td>
                                                <td className="req-book__td">
                                                    <div className="req-book__vehicle-type">{vehicle.type}</div>
                                                    <div className="req-book__vehicle-cap">{vehicle.seating_capacity || 'N/A'} Seats</div>
                                                </td>
                                                <td className="req-book__td req-book__owner">
                                                    {vehicle.vehicle_admin?.name || 'N/A'}
                                                </td>
                                                <td className="req-book__td">
                                                    {vehicle.is_available ? (
                                                        <div className="req-book__badge req-book__badge--available">
                                                            <CheckCircle className="req-book__badge-icon" />
                                                            Available
                                                        </div>
                                                    ) : (
                                                        <div className="req-book__busy-group">
                                                            <div className="req-book__badge req-book__badge--busy">
                                                                <AlertCircle className="req-book__badge-icon" />
                                                                Busy
                                                            </div>
                                                            {vehicle.overlapping_schedules && vehicle.overlapping_schedules.map((schedule, idx) => (
                                                                <div key={idx} className="req-book__busy-note">
                                                                    Busy: {new Date(schedule.start_date).toLocaleDateString()} &rarr; {new Date(schedule.end_date).toLocaleDateString()}
                                                                    <div className="req-book__busy-reason">Reason: {schedule.reason}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="req-book__td req-book__td--right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenBookingModal(vehicle)}
                                                        disabled={!vehicle.is_available}
                                                        className={`req-book__btn-request ${!vehicle.is_available ? 'req-book__btn-request--disabled' : ''}`}
                                                    >
                                                        Request Booking
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="req-book__form-panel">
                    <div className="req-book__form-header">
                        <div>
                            <h2 className="req-book__form-title">Request Booking</h2>
                            <p className="req-book__form-subtitle">
                                {selectedVehicleForBooking.name} ({selectedVehicleForBooking.registration_no})
                            </p>
                        </div>
                        <button 
                            onClick={handleCloseBookingModal}
                            className="req-book__close-btn"
                            title="Cancel Booking"
                        >
                            <X className="req-book__close-icon" />
                        </button>
                    </div>
                    
                    <form onSubmit={submitBooking} className="req-book__form">
                        <div className="req-book__form-group">
                            <div className="req-book__label-row">
                                <label className="req-book__label">
                                    Passenger Count <span className="req-book__required">*</span>
                                </label>
                                <span className="req-book__cap-badge">
                                    Max: {selectedVehicleForBooking.seating_capacity || 'N/A'}
                                </span>
                            </div>
                            <input
                                type="number"
                                required
                                min="1"
                                max={selectedVehicleForBooking.seating_capacity || ''}
                                value={passengerCount}
                                onChange={(e) => setPassengerCount(e.target.value)}
                                className="req-book__input"
                                placeholder="Enter number of passengers"
                            />
                        </div>

                        <div className="req-book__form-group">
                            <label className="req-book__label">Requested Price (Optional)</label>
                            <div className="req-book__input-wrapper">
                                <span className="req-book__input-prefix">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={requestedPrice}
                                    onChange={(e) => setRequestedPrice(e.target.value)}
                                    className="req-book__input req-book__input--with-prefix"
                                    placeholder="Enter negotiated amount"
                                />
                            </div>
                        </div>

                        <div className="req-book__form-group req-book__form-group--last">
                            <label className="req-book__label">Note / Instructions</label>
                            <textarea
                                rows={3}
                                value={bookingNote}
                                onChange={(e) => setBookingNote(e.target.value)}
                                className="req-book__textarea"
                                placeholder="Add any specific instructions or pickup details..."
                            ></textarea>
                        </div>

                        <div className="req-book__form-actions">
                            <button
                                type="button"
                                onClick={handleCloseBookingModal}
                                className="req-book__btn req-book__btn--cancel"
                                disabled={submittingBooking}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submittingBooking || !passengerCount}
                                className="req-book__btn req-book__btn--submit"
                            >
                                {submittingBooking ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RequestVehicleBooking;
