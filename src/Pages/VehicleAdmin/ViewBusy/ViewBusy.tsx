import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Axios from '../../../api/axios';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { CalendarDays, CarFront, FileText, Info, LoaderCircle, Pencil, Save, Trash2, X } from 'lucide-react';
import './ViewBusy.css';

type Vehicle = {
    id: number;
    name: string;
    registration_no: string;
};

type BusySchedule = {
    id: number;
    vehicle_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    note: string | null;
    vehicle: Vehicle | null;
};

type ScheduleForm = {
    vehicle_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    note: string;
};

const REASON_OPTIONS = ['Maintenance', 'Driver Unavailable', 'Trip / Booking', 'Other'];

const formatBusyDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
        .format(new Date(Date.UTC(year, month - 1, day)));
    return `${year} ${monthName} ${String(day).padStart(2, '0')}`;
};

const getErrorMessage = (error: unknown, fallback: string) =>
    (error as AxiosError<{ message?: string }>).response?.data?.message || fallback;

const ViewBusy = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const [schedules, setSchedules] = useState<BusySchedule[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<ScheduleForm | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (user?.role === 'vehicle_admin') {
            fetchBusySchedules();
            fetchVehicles();
        }
    }, [user]);

    const fetchBusySchedules = async () => {
        try {
            setLoading(true);
            const response = await Axios.get('/vehicle/busy-schedules?per_page=100');
            if (response.data.status) {
                const fetchedData = response.data.data.data || response.data.data;
                setSchedules(fetchedData);
            }
        } catch (error) {
            toast.error('Failed to load busy schedules.');
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await Axios.get('/vehicle/list?per_page=100');
            const data = response.data.data;
            setVehicles(data?.data || data || []);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to load your vehicles for editing.'));
        }
    };

    const startEditing = (schedule: BusySchedule) => {
        setEditingId(schedule.id);
        setEditForm({
            vehicle_id: String(schedule.vehicle_id),
            start_date: schedule.start_date.slice(0, 10),
            end_date: schedule.end_date.slice(0, 10),
            reason: schedule.reason,
            note: schedule.note || '',
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const updateSchedule = async (event: React.FormEvent, scheduleId: number) => {
        event.preventDefault();
        if (!editForm) return;
        if (editForm.end_date < editForm.start_date) {
            toast.error('End date cannot be before start date.');
            return;
        }
        if (editForm.reason === 'Other' && !editForm.note.trim()) {
            toast.error('Please provide a note for Other reason.');
            return;
        }

        try {
            setSaving(true);
            const response = await Axios.patch(`/vehicle/busy-schedules/${scheduleId}`, {
                ...editForm,
                vehicle_id: Number(editForm.vehicle_id),
                note: editForm.note.trim() || null,
            });
            if (response.data.status) {
                const updatedSchedule = response.data.data as BusySchedule;
                setSchedules((current) => current.map((schedule) =>
                    schedule.id === scheduleId ? updatedSchedule : schedule
                ));
                cancelEditing();
                toast.success(response.data.message || 'Busy schedule updated.');
            }
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to update busy schedule.'));
        } finally {
            setSaving(false);
        }
    };

    const deleteSchedule = async (schedule: BusySchedule) => {
        const vehicleName = schedule.vehicle?.name || 'this vehicle';
        if (!window.confirm(`Delete the busy schedule for ${vehicleName}? This cannot be undone.`)) return;

        try {
            setDeletingId(schedule.id);
            const response = await Axios.delete(`/vehicle/busy-schedules/${schedule.id}`);
            if (response.data.status) {
                setSchedules((current) => current.filter((item) => item.id !== schedule.id));
                if (editingId === schedule.id) cancelEditing();
                toast.success(response.data.message || 'Busy schedule deleted.');
            }
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to delete busy schedule.'));
        } finally {
            setDeletingId(null);
        }
    };

    const setEditField = (field: keyof ScheduleForm, value: string) => {
        setEditForm((current) => current ? { ...current, [field]: value } : current);
    };

    if (user?.role !== 'vehicle_admin') {
        return (
            <div className="vb-page">
                <section className="vb-empty vb-access-denied">
                    <Info className="vb-empty-icon" />
                    <h1 className="vb-title">Access unavailable</h1>
                    <p className="vb-subtitle">Only Vehicle Admins can view this page.</p>
                </section>
            </div>
        );
    }

    return (
        <main className="vb-page">
            <header className="vb-header">
                <p className="vb-eyebrow">Fleet availability</p>
                <h1 className="vb-title">Busy Vehicles</h1>
                <p className="vb-subtitle">View and manage busy schedules for your vehicles.</p>
            </header>

            <section className="vb-content" aria-live="polite">
                {loading ? (
                    <div className="vb-state">
                        <LoaderCircle className="vb-spinner" />
                        <span>Loading busy schedules...</span>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="vb-empty">
                        <span className="vb-empty-icon-wrap"><CalendarDays className="vb-empty-icon" /></span>
                        <h2 className="vb-empty-title">All clear for now</h2>
                        <p className="vb-empty-copy">There are no busy schedules for your assigned vehicles.</p>
                    </div>
                ) : (
                    <div className="vb-list">
                        {schedules.map((schedule) => (
                            <article className="vb-schedule" key={schedule.id}>
                                <div className="vb-schedule-head">
                                    <span className="vb-vehicle-icon"><CarFront /></span>
                                    <div className="vb-vehicle-copy">
                                        <h2 className="vb-vehicle-name">{schedule.vehicle?.name || 'Unknown vehicle'}</h2>
                                        <p className="vb-registration">{schedule.vehicle?.registration_no || 'Registration unavailable'}</p>
                                    </div>
                                    <span className="vb-status">Busy</span>
                                </div>

                                <div className="vb-dates">
                                    <div className="vb-date-field">
                                        <span className="vb-field-label">Starts</span>
                                        <time className="vb-date-value" dateTime={schedule.start_date.slice(0, 10)}>{formatBusyDate(schedule.start_date)}</time>
                                    </div>
                                    <span className="vb-date-divider" aria-hidden="true" />
                                    <div className="vb-date-field">
                                        <span className="vb-field-label">Ends</span>
                                        <time className="vb-date-value" dateTime={schedule.end_date.slice(0, 10)}>{formatBusyDate(schedule.end_date)}</time>
                                    </div>
                                </div>

                                <div className="vb-details">
                                    <div className="vb-detail">
                                        <span className="vb-field-label">Reason</span>
                                        <span className="vb-detail-value">{schedule.reason}</span>
                                    </div>
                                    {schedule.note && (
                                        <div className="vb-detail vb-detail--note">
                                            <span className="vb-field-label"><FileText /> Note</span>
                                            <span className="vb-detail-value">{schedule.note}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="vb-card-actions">
                                    <button
                                        type="button"
                                        className="vb-action vb-action--edit"
                                        onClick={() => editingId === schedule.id ? cancelEditing() : startEditing(schedule)}
                                        aria-expanded={editingId === schedule.id}
                                    >
                                        <Pencil /> {editingId === schedule.id ? 'Close edit' : 'Edit schedule'}
                                    </button>
                                    <button
                                        type="button"
                                        className="vb-action vb-action--delete"
                                        onClick={() => deleteSchedule(schedule)}
                                        disabled={deletingId === schedule.id}
                                    >
                                        {deletingId === schedule.id ? <LoaderCircle className="vb-spinner" /> : <Trash2 />}
                                        {deletingId === schedule.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>

                                {editingId === schedule.id && editForm && (
                                    <form className="vb-editor" onSubmit={(event) => updateSchedule(event, schedule.id)}>
                                        <div className="vb-editor-heading">
                                            <div>
                                                <p className="vb-eyebrow">Update details</p>
                                                <h3>Edit busy schedule</h3>
                                            </div>
                                            <button className="vb-close-editor" type="button" onClick={cancelEditing} aria-label="Close editor"><X /></button>
                                        </div>

                                        <div className="vb-editor-grid">
                                            <label className="vb-editor-field">
                                                <span>Vehicle</span>
                                                <select value={editForm.vehicle_id} onChange={(event) => setEditField('vehicle_id', event.target.value)} required>
                                                    {!vehicles.some((vehicle) => vehicle.id === Number(editForm.vehicle_id)) && (
                                                        <option value={editForm.vehicle_id}>{schedule.vehicle?.name || 'Current vehicle'}</option>
                                                    )}
                                                    {vehicles.map((vehicle) => (
                                                        <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · {vehicle.registration_no}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label className="vb-editor-field">
                                                <span>Reason</span>
                                                <select value={editForm.reason} onChange={(event) => setEditField('reason', event.target.value)} required>
                                                    {!REASON_OPTIONS.includes(editForm.reason) && <option value={editForm.reason}>{editForm.reason}</option>}
                                                    {REASON_OPTIONS.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                                                </select>
                                            </label>
                                            <label className="vb-editor-field">
                                                <span>Start date</span>
                                                <input type="date" value={editForm.start_date} onChange={(event) => setEditField('start_date', event.target.value)} required />
                                            </label>
                                            <label className="vb-editor-field">
                                                <span>End date</span>
                                                <input type="date" min={editForm.start_date} value={editForm.end_date} onChange={(event) => setEditField('end_date', event.target.value)} required />
                                            </label>
                                            <label className="vb-editor-field vb-editor-field--full">
                                                <span>Note {editForm.reason === 'Other' ? '(required)' : '(optional)'}</span>
                                                <textarea value={editForm.note} onChange={(event) => setEditField('note', event.target.value)} maxLength={1000} rows={3} required={editForm.reason === 'Other'} />
                                            </label>
                                        </div>

                                        <div className="vb-editor-actions">
                                            <button type="button" className="vb-action vb-action--cancel" onClick={cancelEditing}>Cancel</button>
                                            <button type="submit" className="vb-action vb-action--save" disabled={saving}>
                                                {saving ? <LoaderCircle className="vb-spinner" /> : <Save />}
                                                {saving ? 'Saving...' : 'Save changes'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ViewBusy;
