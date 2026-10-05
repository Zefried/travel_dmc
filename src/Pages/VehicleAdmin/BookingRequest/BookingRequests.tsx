import React, { useState, useEffect } from 'react';
import Axios from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Car, CheckCircle, XCircle, Info, MessageSquare } from 'lucide-react';
import './BookingRequests.css';

interface Vehicle {
    id: number;
    name: string;
    registration_no: string;
    type: string;
}

interface MainAdmin {
    id: number;
    name: string;
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
    main_admin: MainAdmin;
}

const BookingRequests = () => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedRequestForReject, setSelectedRequestForReject] = useState<BookingRequest | null>(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [submittingAction, setSubmittingAction] = useState<number | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await Axios.get('/vehicle/booking-requests');
            if (response.data.status) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching booking requests:', error);
            toast.error('Failed to load booking requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (request: BookingRequest) => {
        if (!window.confirm(`Are you sure you want to accept this booking for ${request.vehicle.name}?`)) return;

        setSubmittingAction(request.id);
        try {
            const response = await Axios.patch(`/vehicle/booking-requests/${request.id}/status`, {
                status: 'accepted'
            });

            if (response.data.status) {
                toast.success(response.data.message || 'Request accepted successfully.');
                setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'accepted' } : r));
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.status === 409) {
                toast.error(axiosError.response.data.message || 'Vehicle is already booked for these dates.');
            } else {
                toast.error(axiosError.response?.data?.message || 'Failed to accept request.');
            }
        } finally {
            setSubmittingAction(null);
        }
    };

    const handleReject = (request: BookingRequest) => {
        setSelectedRequestForReject(request);
        setRejectionNote('');
    };

    const submitReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequestForReject) return;
        if (!rejectionNote.trim()) {
            toast.error('A rejection note is required.');
            return;
        }

        setSubmittingAction(selectedRequestForReject.id);
        try {
            const response = await Axios.patch(`/vehicle/booking-requests/${selectedRequestForReject.id}/status`, {
                status: 'rejected',
                rejection_note: rejectionNote
            });

            if (response.data.status) {
                toast.success(response.data.message || 'Request rejected successfully.');
                setRequests(requests.map(r => r.id === selectedRequestForReject.id ? {
                    ...r,
                    status: 'rejected',
                    rejection_note: rejectionNote
                } : r));
                setSelectedRequestForReject(null);
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            toast.error(axiosError.response?.data?.message || 'Failed to reject request.');
        } finally {
            setSubmittingAction(null);
        }
    };

    if (loading) {
        return (
            <div className="bk-reqs__loading">
                <div className="bk-reqs__spinner"></div>
            </div>
        );
    }

    return (
        <div className="bk-reqs">
            <div className="bk-reqs__header">
                <h1 className="bk-reqs__title">
                    <Car className="bk-reqs__title-icon" />
                    Incoming Booking Requests
                </h1>
                <p className="bk-reqs__subtitle">Manage booking requests assigned to your vehicles.</p>
            </div>

            {selectedRequestForReject ? (
                <div className="bk-reqs__modal">
                    <div className="bk-reqs__modal-header">
                        <h2 className="bk-reqs__modal-title">Reject Booking Request</h2>
                        <p className="bk-reqs__modal-subtitle">
                            {selectedRequestForReject.vehicle.name} ({selectedRequestForReject.vehicle.registration_no})
                        </p>
                    </div>
                    <form onSubmit={submitReject} className="bk-reqs__modal-form">
                        <div className="bk-reqs__form-group">
                            <label className="bk-reqs__label">
                                Rejection Note <span className="bk-reqs__required">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                className="bk-reqs__textarea"
                                placeholder="Explain why this request is being rejected..."
                            ></textarea>
                            <p className="bk-reqs__help-text">This note will be visible to the main admin.</p>
                        </div>
                        <div className="bk-reqs__modal-actions">
                            <button
                                type="button"
                                onClick={() => setSelectedRequestForReject(null)}
                                className="bk-reqs__btn bk-reqs__btn--cancel"
                                disabled={submittingAction !== null}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submittingAction !== null || !rejectionNote.trim()}
                                className="bk-reqs__btn bk-reqs__btn--danger"
                            >
                                {submittingAction === selectedRequestForReject.id ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bk-reqs__table-wrap">
                    <table className="bk-reqs__table">
                        <thead>
                            <tr className="bk-reqs__row-head">
                                <th className="bk-reqs__th">Date Range</th>
                                <th className="bk-reqs__th">Vehicle</th>
                                <th className="bk-reqs__th">Request Details</th>
                                <th className="bk-reqs__th">Status</th>
                                <th className="bk-reqs__th bk-reqs__th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="bk-reqs__empty">
                                        No booking requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="bk-reqs__row">
                                        <td className="bk-reqs__td">
                                            <div className="bk-reqs__date-primary">
                                                {new Date(req.start_date).toLocaleDateString()}
                                            </div>
                                            <div className="bk-reqs__date-secondary">
                                                to {new Date(req.end_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="bk-reqs__td">
                                            <div className="bk-reqs__vehicle-name">{req.vehicle?.name}</div>
                                            <div className="bk-reqs__vehicle-reg">{req.vehicle?.registration_no}</div>
                                        </td>
                                        <td className="bk-reqs__td">
                                            <div className="bk-reqs__detail-item">
                                                <span>Passengers:</span> {req.passenger_count}
                                            </div>
                                            {req.requested_price && (
                                                <div className="bk-reqs__detail-item">
                                                    <span>Offered Price:</span> ₹{req.requested_price}
                                                </div>
                                            )}
                                            {req.note && (
                                                <div className="bk-reqs__note">
                                                    <MessageSquare className="bk-reqs__note-icon" />
                                                    <span title={req.note}>{req.note}</span>
                                                </div>
                                            )}
                                            {req.status === 'rejected' && req.rejection_note && (
                                                <div className="bk-reqs__rejection-note">
                                                    <Info className="bk-reqs__note-icon" />
                                                    <span>Reason: {req.rejection_note}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="bk-reqs__td">
                                            <span className={`bk-reqs__status bk-reqs__status--${req.status}`}>
                                                {req.status === 'pending' && <Info className="bk-reqs__status-icon" />}
                                                {req.status === 'accepted' && <CheckCircle className="bk-reqs__status-icon" />}
                                                {req.status === 'rejected' && <XCircle className="bk-reqs__status-icon" />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="bk-reqs__td bk-reqs__td--right">
                                            {req.status === 'pending' ? (
                                                <div className="bk-reqs__action-group">
                                                    <button
                                                        onClick={() => handleAccept(req)}
                                                        disabled={submittingAction !== null}
                                                        className="bk-reqs__btn bk-reqs__btn--accept"
                                                    >
                                                        {submittingAction === req.id ? 'Wait...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req)}
                                                        disabled={submittingAction !== null}
                                                        className="bk-reqs__btn bk-reqs__btn--reject"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="bk-reqs__no-action">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingRequests;
