import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, CarFront, CheckCircle2, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";
import api from "../../../../api/axios";
import "./VehicleCalendar.css";

type Vehicle = {
    id: number;
    name: string | null;
    type: string | null;
    model: string | null;
    registration_no: string | null;
    status: string | null;
};

type CalendarBlock = {
    id: number;
    vehicle_id: number;
    title: string | null;
    status: "busy" | "maintenance" | "available";
    start_date: string;
    end_date: string;
    notes: string | null;
    is_active: boolean;
};

type CalendarDay = {
    date: Date;
    value: string;
    isCurrentMonth: boolean;
};

const pad = (value: number) => String(value).padStart(2, "0");

const toDateValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const monthLabel = (date: Date) => date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const getCalendarDays = (month: Date): CalendarDay[] => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
        return {
            date,
            value: toDateValue(date),
            isCurrentMonth: date.getMonth() === month.getMonth(),
        };
    });
};

const isDateInBlock = (value: string, block: CalendarBlock) => value >= block.start_date.slice(0, 10) && value <= block.end_date.slice(0, 10);

const getErrorMessage = (error: any, fallback: string) => error?.response?.data?.message || fallback;

const VehicleCalendar = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
    const [month, setMonth] = useState(() => new Date());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [notes, setNotes] = useState("");
    const [editingBlock, setEditingBlock] = useState<CalendarBlock | null>(null);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [updatingVehicleStatus, setUpdatingVehicleStatus] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchParams] = useSearchParams();

    const calendarDays = useMemo(() => getCalendarDays(month), [month]);
    const selectedVehicle = vehicles.find((vehicle) => String(vehicle.id) === selectedVehicleId);

    const fetchVehicles = async () => {
        const response = await api.get("/vehicle/list", { params: { per_page: 100 } });
        const payload = response.data?.data;
        const list = Array.isArray(payload) ? payload : payload?.data || [];
        setVehicles(list);
        if (list.length && !selectedVehicleId) setSelectedVehicleId(String(list[0].id));
    };

    const fetchBlocks = async (vehicleId: string) => {
        setLoadingBlocks(true);
        setError("");
        try {
            const response = await api.get("/vehicle/calendar/list", { params: { vehicle_id: vehicleId } });
            setBlocks(response.data?.data || []);
        } catch (requestError) {
            setBlocks([]);
            setError(getErrorMessage(requestError, "Could not load this vehicle's calendar."));
        } finally {
            setLoadingBlocks(false);
        }
    };

    useEffect(() => {
        const loadVehicles = async () => {
            setLoadingVehicles(true);
            setError("");
            try {
                await fetchVehicles();
            } catch (requestError) {
                setError(getErrorMessage(requestError, "Could not load your vehicles."));
            } finally {
                setLoadingVehicles(false);
            }
        };
        void loadVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicleId) void fetchBlocks(selectedVehicleId);
    }, [selectedVehicleId]);

    const handleVehicleChange = (value: string) => {
        setSelectedVehicleId(value);
        setBlocks([]);
        setStartDate("");
        setEndDate("");
        setEditingBlock(null);
        setSuccess("");
        setError("");
    };

    const handleDayClick = (value: string, blocked: boolean) => {
        if (blocked || submitting) return;
        setSuccess("");
        setError("");
        if (!startDate || (startDate && endDate)) {
            setStartDate(value);
            setEndDate("");
            return;
        }
        if (value < startDate) {
            setStartDate(value);
            return;
        }
        const rangeHasBlock = blocks.some((block) => {
            const blockStart = block.start_date.slice(0, 10);
            const blockEnd = block.end_date.slice(0, 10);
            return startDate <= blockEnd && value >= blockStart;
        });
        if (rangeHasBlock) {
            setError("This date range overlaps an existing calendar block.");
            return;
        }
        setEndDate(value);
    };

    const handleEditBlock = (block: CalendarBlock) => {
        setEditingBlock(block);
        setStartDate(block.start_date.slice(0, 10));
        setEndDate(block.end_date.slice(0, 10));
        setNotes(block.notes || "");
        setError("");
        setSuccess("");
    };

    useEffect(() => {
        const editId = Number(searchParams.get("edit"));
        const block = blocks.find((item) => item.id === editId);
        if (block && !editingBlock) handleEditBlock(block);
    }, [blocks, editingBlock, searchParams]);

    const handleCancelEdit = () => {
        setEditingBlock(null);
        setStartDate("");
        setEndDate("");
        setNotes("");
        setError("");
    };

    const handleRemoveBlock = async (block: CalendarBlock) => {
        if (!window.confirm("Remove this busy period? The dates will become selectable again.")) return;

        setError("");
        setSuccess("");
        try {
            await api.delete(`/vehicle/calendar/${block.id}`);
            await fetchBlocks(selectedVehicleId);
            setSuccess("Vehicle calendar entry removed successfully.");
            if (editingBlock?.id === block.id) handleCancelEdit();
        } catch (requestError) {
            setError(getErrorMessage(requestError, "Could not remove this calendar entry."));
        }
    };

    const handleVehicleStatusToggle = async () => {
        if (!selectedVehicle || updatingVehicleStatus) return;

        const nextStatus = selectedVehicle.status === "inactive" ? "active" : "inactive";
        const actionLabel = nextStatus === "inactive" ? "mark this vehicle inactive" : "reactivate this vehicle";

        if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) return;

        setUpdatingVehicleStatus(true);
        setError("");
        setSuccess("");
        try {
            const response = await api.patch(`/vehicle/${selectedVehicle.id}`, {
                status: nextStatus,
            });
            setVehicles((current) => current.map((vehicle) => vehicle.id === selectedVehicle.id
                ? { ...vehicle, status: nextStatus }
                : vehicle));
            setSuccess(response.data?.message || `Vehicle marked ${nextStatus} successfully.`);
        } catch (requestError) {
            setError(getErrorMessage(requestError, "Could not update this vehicle's status."));
        } finally {
            setUpdatingVehicleStatus(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!selectedVehicleId || !startDate || !endDate) {
            setError("Select a vehicle and a start and end date first.");
            return;
        }
        if (endDate < startDate) {
            setError("The end date must be on or after the start date.");
            return;
        }
        setSubmitting(true);
        try {
            const response = editingBlock
                ? await api.patch(`/vehicle/calendar/${editingBlock.id}`, {
                    title: editingBlock.title || "Busy / unavailable",
                    status: editingBlock.status,
                    start_date: startDate,
                    end_date: endDate,
                    notes: notes || null,
                    is_active: true,
                })
                : await api.post("/vehicle/calendar", {
                    vehicle_id: Number(selectedVehicleId),
                    title: "Busy / unavailable",
                    status: "busy",
                    start_date: startDate,
                    end_date: endDate,
                    notes: notes || null,
                    is_active: true,
                });
            const successMessage = response.data?.message || (editingBlock ? "Vehicle calendar entry updated successfully." : "Vehicle calendar entry created successfully.");
            setSuccess(successMessage);
            if (editingBlock) window.alert(successMessage);
            await fetchBlocks(selectedVehicleId);
            setStartDate("");
            setEndDate("");
            setNotes("");
            setEditingBlock(null);
        } catch (requestError: any) {
            if (requestError?.response?.status === 409) {
                setError(editingBlock ? "The updated dates conflict with another calendar block." : "Those dates conflict with an existing calendar block. Choose another range.");
                await fetchBlocks(selectedVehicleId);
            } else {
                setError(getErrorMessage(requestError, "Could not save these busy dates."));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const selectedRangeLabel = startDate
        ? endDate ? `${startDate} to ${endDate}` : `${startDate} - choose an end date`
        : "Choose a start date";

    return (
        <main className="vcal">
            <header className="vcal__header">
                <div>
                    <p className="vcal__eyebrow">Vehicle operations</p>
                    <h1 className="vcal__title">Vehicle calendar</h1>
                    <p className="vcal__subtitle">Select one of your vehicles to manage its busy dates.</p>
                </div>
                <div className="vcal__secure-label"><LockKeyhole size={15} /> Your vehicles only</div>
            </header>

            {error && <div className="vcal__message vcal__message--error"><AlertCircle size={17} /><span>{error}</span></div>}
            {success && <div className="vcal__message vcal__message--success"><CheckCircle2 size={17} /><span>{success}</span></div>}

            <section className="vcal__vehicle-section">
                <label className="vcal__label" htmlFor="vehicle-select">Select vehicle</label>
                {loadingVehicles ? <div className="vcal__loading"><LoaderCircle className="vcal__spin" size={18} /> Loading your vehicles...</div> : vehicles.length === 0 ? <div className="vcal__empty"><CarFront size={23} /><strong>No vehicles assigned yet</strong><span>Your assigned vehicles will appear here.</span></div> : (
                    <select id="vehicle-select" className="vcal__select" value={selectedVehicleId} onChange={(event) => handleVehicleChange(event.target.value)}>
                        {vehicles.map((vehicle) => <option value={vehicle.id} key={vehicle.id}>{vehicle.name || vehicle.type || "Unnamed vehicle"} · {vehicle.registration_no || "No registration"}</option>)}
                    </select>
                )}
                {selectedVehicle && <div className="vcal__vehicle-summary"><div className="vcal__vehicle-icon"><CarFront size={19} /></div><div className="vcal__vehicle-summary-copy"><strong>{selectedVehicle.name || selectedVehicle.type || "Unnamed vehicle"}</strong><span>{selectedVehicle.registration_no || "Registration not provided"} · {selectedVehicle.status || "Status unavailable"}</span></div><button type="button" className={`vcal__status-toggle vcal__status-toggle--${selectedVehicle.status === "inactive" ? "inactive" : "active"}`} onClick={() => void handleVehicleStatusToggle()} disabled={updatingVehicleStatus}>{updatingVehicleStatus ? <LoaderCircle className="vcal__spin" size={14} /> : selectedVehicle.status === "inactive" ? "Reactivate" : "Mark inactive"}</button></div>}
            </section>

            {selectedVehicle && <div className="vcal__workspace">
                <section className="vcal__calendar-panel">
                    <div className="vcal__panel-heading"><div><p className="vcal__eyebrow">Existing blocks</p><h2>{monthLabel(month)}</h2></div><div className="vcal__month-actions"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" title="Previous month"><ArrowLeft size={17} /></button><button type="button" onClick={() => setMonth(new Date())} aria-label="Go to current month" title="Current month"><RotateCcw size={15} /></button><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" title="Next month"><ArrowRight size={17} /></button></div></div>
                    <div className="vcal__calendar-legend"><span><i className="vcal__legend-dot vcal__legend-dot--busy" />Busy / unavailable</span><span><i className="vcal__legend-dot vcal__legend-dot--selected" />Your selection</span></div>
                    {loadingBlocks ? <div className="vcal__loading vcal__loading--calendar"><LoaderCircle className="vcal__spin" size={18} /> Loading calendar...</div> : <div className="vcal__calendar"><div className="vcal__weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="vcal__days">{calendarDays.map(({ date, value, isCurrentMonth }) => { const block = blocks.find((item) => item.is_active && isDateInBlock(value, item)); const isStart = value === startDate; const isEnd = value === endDate; const inSelection = startDate && endDate && value >= startDate && value <= endDate; return <button type="button" key={value} className={`vcal__day ${!isCurrentMonth ? "vcal__day--outside" : ""} ${block ? "vcal__day--blocked" : ""} ${inSelection ? "vcal__day--selected-range" : ""} ${isStart ? "vcal__day--start" : ""} ${isEnd ? "vcal__day--end" : ""}`} disabled={Boolean(block)} onClick={() => handleDayClick(value, Boolean(block))} title={block ? `${block.status}: ${block.start_date.slice(0, 10)} to ${block.end_date.slice(0, 10)}` : "Select date"}><span>{date.getDate()}</span>{block && <i />}</button>; })}</div></div>}
                    <p className="vcal__calendar-help">Tap a start date, then tap an end date. Existing busy dates cannot be selected.</p>
                    <div className="vcal__blocks">
                        <div className="vcal__blocks-heading"><span>Existing busy periods</span><strong>{blocks.filter((block) => block.is_active).length}</strong></div>
                        {blocks.filter((block) => block.is_active).map((block) => <article className="vcal__block" key={block.id}><div><strong>{block.start_date.slice(0, 10)} to {block.end_date.slice(0, 10)}</strong><span>{block.notes || "Busy / unavailable"}</span></div><div className="vcal__block-actions"><button type="button" onClick={() => handleEditBlock(block)}>Edit</button><button type="button" onClick={() => void handleRemoveBlock(block)}>Remove</button></div></article>)}
                        {!blocks.some((block) => block.is_active) && <p className="vcal__blocks-empty">No active busy periods for this vehicle.</p>}
                    </div>
                </section>

                <section className="vcal__form-panel">
                    <div className="vcal__panel-heading"><div><p className="vcal__eyebrow">Block availability</p><h2>{editingBlock ? "Edit busy period" : "Mark busy"}</h2></div><CalendarDays size={20} /></div>
                    <div className="vcal__selected-range"><span>Selected range</span><strong>{selectedRangeLabel}</strong></div>
                    <form onSubmit={handleSubmit}>
                        <div className="vcal__date-fields"><label className="vcal__label" htmlFor="start-date">Start date<input id="start-date" type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setEndDate(""); setError(""); }} /></label><label className="vcal__label" htmlFor="end-date">End date<input id="end-date" type="date" min={startDate || undefined} value={endDate} onChange={(event) => { setEndDate(event.target.value); setError(""); }} /></label></div>
                        <label className="vcal__label" htmlFor="calendar-notes">Notes <span className="vcal__optional">optional</span><textarea id="calendar-notes" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Why is this vehicle unavailable?" /></label>
                        <div className="vcal__form-actions"><button className="vcal__submit" type="submit" disabled={submitting || !startDate || !endDate}>{submitting ? <><LoaderCircle className="vcal__spin" size={17} /> Saving dates...</> : <>{editingBlock ? "Update busy dates" : "Save busy dates"} <ArrowRight size={16} /></>}</button>{editingBlock && <button className="vcal__cancel" type="button" onClick={handleCancelEdit}>Cancel edit</button>}</div>
                    </form>
                </section>
            </div>}
        </main>
    );
};

export default VehicleCalendar;
