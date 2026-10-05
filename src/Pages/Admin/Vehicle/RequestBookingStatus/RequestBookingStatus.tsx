import React, { useState, useEffect } from 'react';
import Axios from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, Car, CheckCircle, XCircle, Info, MessageSquare } from 'lucide-react';
import './RequestBookingStatus.css';

interface Vehicle {
    id: number;
    name: string;
    registration_no: string;
    type: string;
}

interface VehicleAdmin {
    id: number;
    name: string;
    phone: string;
    email: string;
}

interface BookingRequest {
    id: number;
    vehicle_id: number;
    main_admin_id: number;
    vehicle_admin_id: number;
    start_date: string;
    end_date: string;
    passenger_count: number;
    requested_price: number | null;
    note: string | null;
    rejection_note: string | null;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    vehicle: Vehicle;
    vehicle_admin: VehicleAdmin;
}

const RequestBookingStatus = () => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await Axios.get('/admin/vehicles/booking-requests/status');
            if (response.data.status) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching booking requests:', error);
            toast.error('Failed to load booking statuses.');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredBookings = () => {
        if (!filterStartDate || !filterEndDate) return [];
        return requests.filter(req => 
            req.status === 'accepted' && 
            req.start_date <= filterEndDate && 
            req.end_date >= filterStartDate
        );
    };

    if (loading) {
        return (
            <div className="req-status__loading">
                <div className="req-status__spinner"></div>
            </div>
        );
    }

    return (
        <div className="req-status">
            <div className="req-status__header">
                <h1 className="req-status__title">
                    <CalendarIcon className="req-status__title-icon" />
                    Booking Request Status
                </h1>
                <p className="req-status__subtitle">Track the status of your vehicle booking requests and view confirmed dates.</p>
            </div>

            <div className="req-status__layout">
                {/* Left Side: Filters & Results */}
                <div className="req-status__sidebar">
                    <div className="req-status__panel">
                        <h2 className="req-status__panel-title">Check Availability Range</h2>
                        <div className="req-status__form">
                            <div className="req-status__field">
                                <label className="req-status__label">Start Date</label>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="req-status__input"
                                />
                            </div>
                            <div className="req-status__field">
                                <label className="req-status__label">End Date</label>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    min={filterStartDate}
                                    className="req-status__input"
                                />
                            </div>
                        </div>
                    </div>

                    {filterStartDate && filterEndDate && (
                        <div className="req-status__panel">
                            <h3 className="req-status__panel-title">Bookings in Range</h3>
                            
                            {getFilteredBookings().length === 0 ? (
                                <p className="req-status__empty-text">No confirmed bookings in this date range.</p>
                            ) : (
                                <div className="req-status__results req-status__scrollbar">
                                    {getFilteredBookings().map(req => (
                                        <div key={req.id} className="req-status__card">
                                            <div className="req-status__card-header">
                                                <Car className="req-status__card-icon" />
                                                {req.vehicle?.name}
                                            </div>
                                            <div className="req-status__card-reg">{req.vehicle?.registration_no}</div>
                                            <div className="req-status__card-dates">
                                                {new Date(req.start_date).toLocaleDateString()} to {new Date(req.end_date).toLocaleDateString()}
                                            </div>
                                            <div className="req-status__card-footer">
                                                <div className="req-status__card-meta">
                                                    <span>Passengers</span>
                                                    <strong>{req.passenger_count}</strong>
                                                </div>
                                                <div className="req-status__card-meta">
                                                    <span>Owner</span>
                                                    <strong className="req-status__truncate">{req.vehicle_admin?.name || 'N/A'}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Data Table */}
                <div className="req-status__content">
                    <div className="req-status__table-panel">
                        <div className="req-status__table-header">
                            <h2 className="req-status__table-title">All Requests History</h2>
                        </div>
                        <div className="req-status__table-wrap">
                            <table className="req-status__table">
                                <thead>
                                    <tr className="req-status__row-head">
                                        <th className="req-status__th">Date Range</th>
                                        <th className="req-status__th">Vehicle & Owner</th>
                                        <th className="req-status__th">Details</th>
                                        <th className="req-status__th">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="req-status__empty">
                                                You haven't made any booking requests yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} className="req-status__row">
                                                <td className="req-status__td">
                                                    <div className="req-status__date-primary">
                                                        {new Date(req.start_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="req-status__date-secondary">
                                                        to {new Date(req.end_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="req-status__td">
                                                    <div className="req-status__vehicle-name">{req.vehicle?.name}</div>
                                                    <div className="req-status__vehicle-reg">{req.vehicle?.registration_no}</div>
                                                    <div className="req-status__owner-name">Owner: {req.vehicle_admin?.name || 'N/A'}</div>
                                                </td>
                                                <td className="req-status__td">
                                                    <div className="req-status__detail-item">
                                                        <span>Passengers:</span> {req.passenger_count}
                                                    </div>
                                                    {req.requested_price && (
                                                        <div className="req-status__detail-item">
                                                            <span>Offered Price:</span> ₹{req.requested_price}
                                                        </div>
                                                    )}
                                                    {req.note && (
                                                        <div className="req-status__note">
                                                            <MessageSquare className="req-status__note-icon" />
                                                            <span title={req.note}>{req.note}</span>
                                                        </div>
                                                    )}
                                                    {req.status === 'rejected' && req.rejection_note && (
                                                        <div className="req-status__rejection-note">
                                                            <Info className="req-status__note-icon" />
                                                            <span>Reason: {req.rejection_note}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="req-status__td">
                                                    <span className={`req-status__badge req-status__badge--${req.status}`}>
                                                        {req.status === 'pending' && <Info className="req-status__badge-icon" />}
                                                        {req.status === 'accepted' && <CheckCircle className="req-status__badge-icon" />}
                                                        {req.status === 'rejected' && <XCircle className="req-status__badge-icon" />}
                                                        {req.status === 'accepted' ? 'Confirmed' : req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestBookingStatus;
