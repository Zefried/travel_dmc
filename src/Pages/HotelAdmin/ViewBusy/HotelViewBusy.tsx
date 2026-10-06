import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Axios from '../../../api/axios';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { CalendarDays, DoorOpen, FileText, Info, LoaderCircle, Pencil, Save, Trash2, X } from 'lucide-react';
import './HotelViewBusy.css';

type RoomType = {
    id: number;
    name: string;
    property_id: number;
    property: {
        id: number;
        name: string;
    };
};

type Room = {
    id: number;
    room_no: string;
    room_type_id: number;
    roomType: RoomType;
};

type BusySchedule = {
    id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    note: string | null;
    room: Room;
};

type ScheduleForm = {
    start_date: string;
    end_date: string;
    reason: string;
    note: string;
};

const REASON_OPTIONS = ['Maintenance', 'Deep Cleaning', 'Reserved', 'Under Renovation', 'Other'];

const formatBusyDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
        .format(new Date(Date.UTC(year, month - 1, day)));
    return `${year} ${monthName} ${String(day).padStart(2, '0')}`;
};

const getErrorMessage = (error: unknown, fallback: string) =>
    (error as AxiosError<{ message?: string }>).response?.data?.message || fallback;

const HotelViewBusy = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const [schedules, setSchedules] = useState<BusySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<ScheduleForm | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (user?.role === 'hotel_admin') {
            fetchBusySchedules();
        }
    }, [user]);

    const fetchBusySchedules = async () => {
        try {
            setLoading(true);
            const response = await Axios.get('/hotel/room-busy-schedules?per_page=100');
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

    const startEditing = (schedule: BusySchedule) => {
        setEditingId(schedule.id);
        setEditForm({
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
            const response = await Axios.patch(`/hotel/room-busy-schedules/${scheduleId}`, {
                start_date: editForm.start_date,
                end_date: editForm.end_date,
                reason: editForm.reason,
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
        const roomName = `Room ${schedule.room?.room_no || ''}`;
        if (!window.confirm(`Delete the busy schedule for ${roomName}? This cannot be undone.`)) return;

        try {
            setDeletingId(schedule.id);
            const response = await Axios.delete(`/hotel/room-busy-schedules/${schedule.id}`);
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

    if (user?.role !== 'hotel_admin') {
        return (
            <div className="hvb-page">
                <section className="hvb-empty hvb-access-denied">
                    <Info className="hvb-empty-icon" />
                    <h1 className="hvb-title">Access unavailable</h1>
                    <p className="hvb-subtitle">Only Hotel Admins can view this page.</p>
                </section>
            </div>
        );
    }

    return (
        <main className="hvb-page">
            <header className="hvb-header">
                <p className="hvb-eyebrow">Inventory Management</p>
                <h1 className="hvb-title">Busy Rooms</h1>
                <p className="hvb-subtitle">View and manage busy schedules for your rooms.</p>
            </header>

            <section className="hvb-content" aria-live="polite">
                {loading ? (
                    <div className="hvb-state">
                        <LoaderCircle className="hvb-spinner" />
                        <span>Loading busy schedules...</span>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="hvb-empty">
                        <span className="hvb-empty-icon-wrap"><CalendarDays className="hvb-empty-icon" /></span>
                        <h2 className="hvb-empty-title">All clear for now</h2>
                        <p className="hvb-empty-copy">There are no busy schedules for your rooms.</p>
                    </div>
                ) : (
                    <div className="hvb-list">
                        {schedules.map((schedule) => (
                            <article className="hvb-schedule" key={schedule.id}>
                                <div className="hvb-schedule-head">
                                    <span className="hvb-room-icon"><DoorOpen /></span>
                                    <div className="hvb-room-copy">
                                        <h2 className="hvb-room-name">Room {schedule.room?.room_no || 'Unknown'}</h2>
                                        <p className="hvb-registration">
                                            {schedule.room?.roomType?.name || ''} · {schedule.room?.roomType?.property?.name || ''}
                                        </p>
                                    </div>
                                    <span className="hvb-status">Busy</span>
                                </div>

                                <div className="hvb-dates">
                                    <div className="hvb-date-field">
                                        <span className="hvb-field-label">Starts</span>
                                        <time className="hvb-date-value" dateTime={schedule.start_date.slice(0, 10)}>{formatBusyDate(schedule.start_date)}</time>
                                    </div>
                                    <span className="hvb-date-divider" aria-hidden="true" />
                                    <div className="hvb-date-field">
                                        <span className="hvb-field-label">Ends</span>
                                        <time className="hvb-date-value" dateTime={schedule.end_date.slice(0, 10)}>{formatBusyDate(schedule.end_date)}</time>
                                    </div>
                                </div>

                                <div className="hvb-details">
                                    <div className="hvb-detail">
                                        <span className="hvb-field-label">Reason</span>
                                        <span className="hvb-detail-value">{schedule.reason}</span>
                                    </div>
                                    {schedule.note && (
                                        <div className="hvb-detail hvb-detail--note">
                                            <span className="hvb-field-label"><FileText /> Note</span>
                                            <span className="hvb-detail-value">{schedule.note}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="hvb-card-actions">
                                    <button
                                        type="button"
                                        className="hvb-action hvb-action--edit"
                                        onClick={() => editingId === schedule.id ? cancelEditing() : startEditing(schedule)}
                                        aria-expanded={editingId === schedule.id}
                                    >
                                        <Pencil /> {editingId === schedule.id ? 'Close edit' : 'Edit schedule'}
                                    </button>
                                    <button
                                        type="button"
                                        className="hvb-action hvb-action--delete"
                                        onClick={() => deleteSchedule(schedule)}
                                        disabled={deletingId === schedule.id}
                                    >
                                        {deletingId === schedule.id ? <LoaderCircle className="hvb-spinner" /> : <Trash2 />}
                                        {deletingId === schedule.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>

                                {editingId === schedule.id && editForm && (
                                    <form className="hvb-editor" onSubmit={(event) => updateSchedule(event, schedule.id)}>
                                        <div className="hvb-editor-heading">
                                            <div>
                                                <p className="hvb-eyebrow">Update details</p>
                                                <h3>Edit busy schedule</h3>
                                            </div>
                                            <button className="hvb-close-editor" type="button" onClick={cancelEditing} aria-label="Close editor"><X /></button>
                                        </div>

                                        <div className="hvb-editor-grid">
                                            <label className="hvb-editor-field">
                                                <span>Reason</span>
                                                <select value={editForm.reason} onChange={(event) => setEditField('reason', event.target.value)} required>
                                                    {!REASON_OPTIONS.includes(editForm.reason) && <option value={editForm.reason}>{editForm.reason}</option>}
                                                    {REASON_OPTIONS.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                                                </select>
                                            </label>
                                            <div /> {/* Empty div to force the date fields to the next row if needed, or keep it 2 columns. Given the original had vehicle in one, reason in another, let's just let it flow. The vehicle selector is gone. Let's make reason full width or add a dummy field. */}
                                            <label className="hvb-editor-field">
                                                <span>Start date</span>
                                                <input type="date" value={editForm.start_date} onChange={(event) => setEditField('start_date', event.target.value)} required />
                                            </label>
                                            <label className="hvb-editor-field">
                                                <span>End date</span>
                                                <input type="date" min={editForm.start_date} value={editForm.end_date} onChange={(event) => setEditField('end_date', event.target.value)} required />
                                            </label>
                                            <label className="hvb-editor-field hvb-editor-field--full">
                                                <span>Note {editForm.reason === 'Other' ? '(required)' : '(optional)'}</span>
                                                <textarea value={editForm.note} onChange={(event) => setEditField('note', event.target.value)} maxLength={1000} rows={3} required={editForm.reason === 'Other'} />
                                            </label>
                                        </div>

                                        <div className="hvb-editor-actions">
                                            <button type="button" className="hvb-action hvb-action--cancel" onClick={cancelEditing}>Cancel</button>
                                            <button type="submit" className="hvb-action hvb-action--save" disabled={saving}>
                                                {saving ? <LoaderCircle className="hvb-spinner" /> : <Save />}
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

export default HotelViewBusy;
