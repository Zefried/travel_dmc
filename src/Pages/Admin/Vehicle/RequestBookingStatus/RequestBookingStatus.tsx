import React, { useState, useEffect } from 'react';
import Axios from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, Car, CheckCircle, XCircle, Info, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200"><Info className="w-4 h-4" /> Pending</span>;
            case 'accepted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"><CheckCircle className="w-4 h-4" /> Confirmed</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-200"><XCircle className="w-4 h-4" /> Rejected</span>;
            default:
                return <span className="text-gray-500">{status}</span>;
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="h-8 w-8 text-blue-600" />
                    Booking Request Status
                </h1>
                <p className="text-gray-500 mt-2">Track the status of your vehicle booking requests and view confirmed dates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Filter Section (Left side) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Check Availability Range</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    min={filterStartDate}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filtered Results */}
                    {filterStartDate && filterEndDate && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-md font-bold text-gray-900 mb-4">
                                Bookings in Range
                            </h3>
                            
                            {getFilteredBookings().length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No confirmed bookings in this date range.</p>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {getFilteredBookings().map(req => (
                                        <div key={req.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Car className="w-4 h-4 text-blue-600" />
                                                {req.vehicle?.name}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">{req.vehicle?.registration_no}</div>
                                            <div className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 w-fit px-2 py-1 rounded">
                                                {new Date(req.start_date).toLocaleDateString()} to {new Date(req.end_date).toLocaleDateString()}
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Passengers</span>
                                                    <span className="font-medium">{req.passenger_count}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Owner</span>
                                                    <span className="font-medium truncate block">{req.vehicle_admin?.name || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Data Table Section (Right side) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">All Requests History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                        <th className="p-4 font-medium">Date Range</th>
                                        <th className="p-4 font-medium">Vehicle & Owner</th>
                                        <th className="p-4 font-medium">Details</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                You haven't made any booking requests yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 align-top">
                                                    <div className="font-medium text-gray-900 whitespace-nowrap">
                                                        {new Date(req.start_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-gray-500 text-sm whitespace-nowrap mt-0.5">
                                                        to {new Date(req.end_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="font-semibold text-gray-900">{req.vehicle?.name}</div>
                                                    <div className="text-sm text-gray-500">{req.vehicle?.registration_no}</div>
                                                    <div className="text-xs text-gray-400 mt-2">Owner: {req.vehicle_admin?.name || 'N/A'}</div>
                                                </td>
                                                <td className="p-4 align-top">
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
                                                        <div className="text-sm text-red-600 mt-1 p-2 bg-red-50 rounded-md border border-red-100 flex items-start gap-1">
                                                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                            <span>Reason: {req.rejection_note}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    {getStatusBadge(req.status)}
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
