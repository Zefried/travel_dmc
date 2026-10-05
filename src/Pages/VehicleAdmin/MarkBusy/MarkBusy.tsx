import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Axios from '../../../api/axios';
import { Car, Calendar, List, CheckCircle, Edit2, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import './MarkBusy.css';

type Vehicle = {
    id: number;
    name: string;
    model: string;
    registration_no: string;
    type: string;
};

const REASON_OPTIONS = [
    'Maintenance',
    'Driver Unavailable',
    'Trip / Booking',
    'Other'
];

const MarkBusy = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    // State Management
    const [step, setStep] = useState<number>(1);

    // Step 1: Vehicle
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // Step 2: Dates
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Step 3: Reason
    const [reason, setReason] = useState<string>('');
    const [note, setNote] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoadingVehicles(true);
            // Reusing the existing list API. It automatically scopes to the assigned vehicles for vehicle_admin.
            const response = await Axios.get('/vehicle/list?per_page=100');
            if (response.data.status) {
                // If it's paginated, access data.data. Otherwise data
                const fetchedVehicles = response.data.data.data || response.data.data;
                setVehicles(fetchedVehicles);
            }
        } catch (error) {
            toast.error('Failed to load your assigned vehicles.');
        } finally {
            setLoadingVehicles(false);
        }
    };

    // Navigation and Reset logic
    const handleEditStep = (targetStep: number) => {
        setStep(targetStep);
        // Cascading reset
        if (targetStep <= 1) {
            setSelectedVehicle(null);
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        } else if (targetStep <= 2) {
            setStartDate('');
            setEndDate('');
            setReason('');
            setNote('');
        } else if (targetStep <= 3) {
            setReason('');
            setNote('');
        }
    };

    const handleVehicleSelect = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setStep(2);
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
        setStep(3);
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
        setStep(4);
    };

    const submitBusySchedule = async () => {
        if (!selectedVehicle || !startDate || !endDate || !reason) return;

        try {
            setSubmitting(true);
            const response = await Axios.post('/vehicle/mark-busy', {
                vehicle_id: selectedVehicle.id,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
                note: reason === 'Other' ? note : null
            });

            if (response.data.status) {
                toast.success(response.data.message || 'Vehicle successfully marked as busy.');
                alert(response.data.message || 'Vehicle successfully marked as busy.');
                // Reset form to Step 1
                handleEditStep(1);
            } else {
                toast.error(response.data.message || 'Failed to submit.');
                alert(response.data.message || 'Failed to submit.');
            }
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.data?.message) {
                toast.error(axiosError.response.data.message);
                alert(axiosError.response.data.message);
            } else {
                toast.error('Failed to submit. Please try again.');
                alert('Failed to submit. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Helper for today's date format (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="mb-page">
            <header className="mb-header">
                <p className="mb-eyebrow">Fleet availability</p>
                <h1 className="mb-title">Mark Vehicle Busy</h1>
                <p className="mb-subtitle">Welcome, {user?.name || 'Vehicle Admin'}. Manage your fleet schedules here.</p>
            </header>

            {/* PROGRESSIVE SUMMARY BAR */}
            <div className="mb-summaries">
                {/* Vehicle Summary */}
                {step > 1 && selectedVehicle && (
                    <div className="mb-summary mb-summary--vehicle mb-fade-in">
                        <div className="mb-summary-copy">
                            <Car className="mb-summary-icon" />
                            <div>
                                <p className="mb-summary-label">Selected Vehicle</p>
                                <p className="mb-summary-value">{selectedVehicle.name} ({selectedVehicle.registration_no})</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(1)} className="mb-summary-action">
                            <Edit2 className="mb-action-icon" /> Change
                        </button>
                    </div>
                )}

                {/* Dates Summary */}
                {step > 2 && startDate && endDate && (
                    <div className="mb-summary mb-summary--dates mb-fade-in">
                        <div className="mb-summary-copy">
                            <Calendar className="mb-summary-icon" />
                            <div>
                                <p className="mb-summary-label">Busy Duration</p>
                                <p className="mb-summary-value">{startDate} to {endDate}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(2)} className="mb-summary-action">
                            <Edit2 className="mb-action-icon" /> Edit
                        </button>
                    </div>
                )}

                {/* Reason Summary */}
                {step > 3 && reason && (
                    <div className="mb-summary mb-summary--reason mb-fade-in">
                        <div className="mb-summary-copy">
                            <List className="mb-summary-icon" />
                            <div>
                                <p className="mb-summary-label">Reason</p>
                                <p className="mb-summary-value">{reason} {reason === 'Other' && `- ${note}`}</p>
                            </div>
                        </div>
                        <button onClick={() => handleEditStep(3)} className="mb-summary-action">
                            <Edit2 className="mb-action-icon" /> Edit
                        </button>
                    </div>
                )}
            </div>

            {/* ACTIVE WIZARD STEP */}
            <div className="mb-card">
                {/* Step 1: Vehicle Selection */}
                {step === 1 && (
                    <div className="mb-panel">
                        <h2 className="mb-step-title">
                            <span className="mb-step-number">1</span>
                            Select a Vehicle
                        </h2>

                        {loadingVehicles ? (
                            <div className="mb-loading">
                                <Loader2 className="mb-spin" /> Loading assigned vehicles...
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="mb-empty">
                                <Info className="mb-empty-icon" />
                                <p>You don't have any assigned vehicles to manage.</p>
                            </div>
                        ) : (
                            <div className="mb-vehicle-grid">
                                {vehicles.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVehicleSelect(v)}
                                        className="mb-vehicle"
                                    >
                                        <div className="mb-vehicle-row">
                                            <div className="mb-vehicle-copy">
                                                <p className="mb-vehicle-name">{v.name}</p>
                                                <p className="mb-vehicle-meta">{v.type} - {v.model}</p>
                                            </div>
                                            <span className="mb-vehicle-plate">
                                                {v.registration_no}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Date Selection */}
                {step === 2 && (
                    <div className="mb-panel">
                        <h2 className="mb-step-title">
                            <span className="mb-step-number">2</span>
                            Select Date Range
                        </h2>
                        <form onSubmit={handleDateSubmit}>
                            <div className="mb-form-grid">
                                <div className="mb-field">
                                    <label className="mb-label">Start Date</label>
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
                                        className="mb-control"
                                        required
                                    />
                                </div>
                                <div className="mb-field">
                                    <label className="mb-label">End Date</label>
                                    <input
                                        type="date"
                                        min={startDate || todayStr}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mb-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-actions">
                                <button type="submit" className="mb-button">
                                    Confirm Dates
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 3: Reason Selection */}
                {step === 3 && (
                    <div className="mb-panel">
                        <h2 className="mb-step-title">
                            <span className="mb-step-number">3</span>
                            Provide a Reason
                        </h2>
                        <form onSubmit={handleReasonSubmit}>
                            <div className="mb-form-stack">
                                <div className="mb-field">
                                    <label className="mb-label">Reason for Unavailability</label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="mb-control"
                                        required
                                    >
                                        <option value="" disabled>Select a reason...</option>
                                        {REASON_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {reason === 'Other' && (
                                    <div className="mb-field mb-fade-in">
                                        <label className="mb-label">Please explain (Required)</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            rows={3}
                                            className="mb-control mb-textarea"
                                            placeholder="Enter detailed reason..."
                                            required
                                        ></textarea>
                                    </div>
                                )}
                            </div>
                            <div className="mb-actions">
                                <button type="submit" className="mb-button">
                                    Confirm Reason
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 4: Final Confirmation */}
                {step === 4 && (
                    <div className="mb-confirm">
                        <div className="mb-confirm-icon">
                            <CheckCircle />
                        </div>
                        <h2 className="mb-confirm-title">Ready to Submit</h2>
                        <p className="mb-confirm-copy">
                            Please review the summary above. If everything is correct, click the button below to lock in the busy schedule.
                        </p>

                        <button
                            onClick={submitBusySchedule}
                            disabled={submitting}
                            className="mb-button mb-button--confirm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mb-spin" /> Marking Busy...
                                </>
                            ) : (
                                'Mark Vehicle as Busy'
                            )}
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MarkBusy;
