import React, { useState, useEffect } from 'react';
import Axios from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Car, CheckCircle, XCircle, Info, MessageSquare } from 'lucide-react';

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
    const [submittingAction, setSubmittingAction] = useState<number | null>(null); // Request ID being processed

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200"><Info className="w-4 h-4" /> Pending</span>;
            case 'accepted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"><CheckCircle className="w-4 h-4" /> Accepted</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-200"><XCircle className="w-4 h-4" /> Rejected</span>;
            default:
                return <span className="text-gray-500">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Car className="h-8 w-8 text-blue-600" />
                    Incoming Booking Requests
                </h1>
                <p className="text-gray-500 mt-2">Manage booking requests assigned to your vehicles.</p>
            </div>

            {selectedRequestForReject ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Reject Booking Request</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedRequestForReject.vehicle.name} ({selectedRequestForReject.vehicle.registration_no})
                        </p>
                    </div>
                    <form onSubmit={submitReject} className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Note <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Explain why this request is being rejected..."
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">This note will be visible to the main admin.</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setSelectedRequestForReject(null)}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={submittingAction !== null}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submittingAction !== null || !rejectionNote.trim()}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                            >
                                {submittingAction === selectedRequestForReject.id ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Confirm Rejection'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                    <th className="p-4 font-medium">Date Range</th>
                                    <th className="p-4 font-medium">Vehicle</th>
                                    <th className="p-4 font-medium">Request Details</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No booking requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">
                                                    {new Date(req.start_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    to {new Date(req.end_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{req.vehicle?.name}</div>
                                                <div className="text-sm text-gray-500">{req.vehicle?.registration_no}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-700">
                                                    <span className="font-medium">Passengers:</span> {req.passenger_count}
                                                </div>
                                                {req.requested_price && (
                                                    <div className="text-sm text-gray-700">
                                                        <span className="font-medium">Offered Price:</span> ₹{req.requested_price}
                                                    </div>
                                                )}
                                                {req.note && (
                                                    <div className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                                                        <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2" title={req.note}>{req.note}</span>
                                                    </div>
                                                )}
                                                {req.status === 'rejected' && req.rejection_note && (
                                                    <div className="text-sm text-red-600 mt-1 flex items-start gap-1">
                                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span>Reason: {req.rejection_note}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(req.status)}
                                            </td>
                                            <td className="p-4 text-right">
                                                {req.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAccept(req)}
                                                            disabled={submittingAction !== null}
                                                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                                                        >
                                                            {submittingAction === req.id ? 'Processing...' : 'Accept'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req)}
                                                            disabled={submittingAction !== null}
                                                            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingRequests;
