import React, { useState, useEffect } from 'react';
import Axios from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Calendar, Car, AlertCircle, CheckCircle, Search, User, X } from 'lucide-react';

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

    // Fetch owners on mount
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

    // Auto fetch availability when dependencies change
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
        console.log("Opening modal for vehicle:", vehicle);
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
                // Optionally refetch availability to be extra safe, though pending doesn't mean busy yet.
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.data?.message) {
                toast.error(axiosError.response.data.message);
                alert(axiosError.response.data.message);
            } else {
                toast.error('Failed to submit booking request. Please try again.');
                alert('Failed to submit booking request. Please try again.');
            }
        } finally {
            setSubmittingBooking(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Car className="h-8 w-8 text-blue-600" />
                    Request Vehicle Booking
                </h1>
                <p className="text-gray-500 mt-2">Check availability of vehicles based on specific dates and request a booking.</p>
            </div>

            {!selectedVehicleForBooking ? (
                <>
                    {/* Filter Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline-block w-4 h-4 mr-1 text-gray-400" />
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline-block w-4 h-4 mr-1 text-gray-400" />
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline-block w-4 h-4 mr-1 text-gray-400" />
                                    Vehicle Owner (Optional)
                                </label>
                                <select
                                    value={ownerId}
                                    onChange={(e) => setOwnerId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Search className="h-5 w-5 text-gray-400" />
                                    Availability Results
                                </h2>
                                {loading && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                                        Checking...
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                            <th className="p-4 font-medium">Vehicle Info</th>
                                            <th className="p-4 font-medium">Type & Capacity</th>
                                            <th className="p-4 font-medium">Owner</th>
                                            <th className="p-4 font-medium">Availability Status</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {vehicles.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                                    No vehicles found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                        {vehicles.map(vehicle => (
                                            <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-semibold text-gray-900">{vehicle.name} ({vehicle.model})</div>
                                                    <div className="text-sm text-gray-500 mt-1">{vehicle.registration_no}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-gray-900">{vehicle.type}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{vehicle.seating_capacity || 'N/A'} Seats</div>
                                                </td>
                                                <td className="p-4 text-gray-700">
                                                    {vehicle.vehicle_admin?.name || 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    {vehicle.is_available ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Available
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-200 w-fit">
                                                                <AlertCircle className="w-4 h-4" />
                                                                Busy
                                                            </div>
                                                            {vehicle.overlapping_schedules && vehicle.overlapping_schedules.map((schedule, idx) => (
                                                                <div key={idx} className="text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                                                                    Busy: {new Date(schedule.start_date).toLocaleDateString()} &rarr; {new Date(schedule.end_date).toLocaleDateString()}
                                                                    <div className="mt-0.5 text-red-500 font-medium">Reason: {schedule.reason}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenBookingModal(vehicle)}
                                                        disabled={!vehicle.is_available}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            vehicle.is_available 
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Request Booking
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedVehicleForBooking.name} ({selectedVehicleForBooking.registration_no})
                            </p>
                        </div>
                        <button 
                            onClick={handleCloseBookingModal}
                            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                            title="Cancel Booking"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={submitBooking} className="p-6">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Passenger Count <span className="text-red-500">*</span>
                                </label>
                                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
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
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number of passengers"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requested Price (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={requestedPrice}
                                    onChange={(e) => setRequestedPrice(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 pl-8 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter negotiated amount"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Note / Instructions
                            </label>
                            <textarea
                                rows={3}
                                value={bookingNote}
                                onChange={(e) => setBookingNote(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Add any specific instructions or pickup details..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleCloseBookingModal}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                disabled={submittingBooking}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submittingBooking || !passengerCount}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            >
                                {submittingBooking ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RequestVehicleBooking;
