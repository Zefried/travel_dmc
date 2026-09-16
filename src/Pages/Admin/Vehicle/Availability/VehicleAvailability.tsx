import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CarFront, CheckCircle2, ChevronRight, Filter, LoaderCircle, Search, Users, Wrench, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../../api/axios";
import "./VehicleAvailability.css";

type VehicleOwner = { id: number; name: string; email: string | null; phone: string | null };
type VehicleBlock = { id: number; status: "busy" | "maintenance"; start_date: string; end_date: string; notes: string | null };
type Vehicle = { id: number; vehicle_admin_id: number | null; name: string | null; type: string | null; model: string | null; registration_no: string | null; seating_capacity: number | null; driver_name: string | null; status: string | null; availability: "available" | "unavailable"; availability_reason: string | null; vehicle_admin: VehicleOwner | null; calendars: VehicleBlock[] };
type Filter = "all" | "available" | "unavailable";

const today = new Date().toISOString().slice(0, 10);
const plusDays = (value: string, days: number) => { const date = new Date(`${value}T00:00:00`); date.setDate(date.getDate() + days); return date.toISOString().slice(0, 10); };
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const errorMessage = (error: any) => error?.response?.data?.message || "Could not load fleet availability.";

const VehicleAvailability = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleAdmins, setVehicleAdmins] = useState<VehicleOwner[]>([]);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(plusDays(today, 6));
    const [ownerFilter, setOwnerFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [range, setRange] = useState({ start_date: today, end_date: plusDays(today, 6) });

    const loadAvailability = async (rangeStart = startDate, rangeEnd = endDate) => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/vehicle/availability", { params: { start_date: rangeStart, end_date: rangeEnd, per_page: 100 } });
            const payload = response.data?.data;
            setVehicles(Array.isArray(payload) ? payload : payload?.data || []);
            setRange(response.data?.range || { start_date: rangeStart, end_date: rangeEnd });
        } catch (requestError) {
            setError(errorMessage(requestError));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadOwners = async () => {
            try {
                const response = await api.get("/admin/vehicle-admins/list");
                setVehicleAdmins(response.data?.data || []);
            } catch {
                setVehicleAdmins([]);
            }
        };
        void loadOwners();
        void loadAvailability();
    }, []);

    const filteredVehicles = useMemo(() => vehicles.filter((vehicle) => {
        const text = search.trim().toLowerCase();
        const matchesOwner = ownerFilter === "all" || String(vehicle.vehicle_admin_id) === ownerFilter;
        const matchesStatus = !statusFilter || vehicle.status === statusFilter;
        const matchesAvailability = availabilityFilter === "all" || vehicle.availability === availabilityFilter;
        const matchesSearch = !text || [vehicle.name, vehicle.type, vehicle.model, vehicle.registration_no, vehicle.driver_name, vehicle.vehicle_admin?.name].filter(Boolean).some((value) => value?.toLowerCase().includes(text));
        return matchesOwner && matchesStatus && matchesAvailability && matchesSearch;
    }), [availabilityFilter, ownerFilter, search, statusFilter, vehicles]);

    const counts = { total: vehicles.length, active: vehicles.filter((vehicle) => vehicle.status === "active").length, inactive: vehicles.filter((vehicle) => vehicle.status === "inactive").length, available: vehicles.filter((vehicle) => vehicle.availability === "available").length };

    const submitRange = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (startDate && endDate && endDate >= startDate) void loadAvailability(); };

    return (
        <main className="vfa">
            <header className="vfa__header"><div><p className="vfa__eyebrow">Main Admin · Fleet control</p><h1 className="vfa__title">Vehicle availability</h1><p className="vfa__subtitle">See which vehicles can operate during a selected date range.</p></div><div className="vfa__range-label"><CalendarDays size={17} /><span>{formatDate(range.start_date)} - {formatDate(range.end_date)}</span></div></header>

            {error && <div className="vfa__message vfa__message--error"><XCircle size={17} />{error}</div>}

            <form className="vfa__range-form" onSubmit={submitRange}><label>From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>To<input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label><button type="submit" disabled={loading || !startDate || !endDate}><CalendarDays size={16} /> Check range</button></form>

            <section className="vfa__summary" aria-label="Fleet summary"><article><CarFront size={17} /><span>Total vehicles</span><strong>{counts.total}</strong></article><article><CheckCircle2 size={17} /><span>Available</span><strong>{counts.available}</strong></article><article><Wrench size={17} /><span>Active</span><strong>{counts.active}</strong></article><article><XCircle size={17} /><span>Inactive</span><strong>{counts.inactive}</strong></article></section>

            <section className="vfa__controls"><div className="vfa__search"><Search size={16} /><input placeholder="Search vehicle, owner, registration" value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="vfa__filters"><label><Users size={14} /> Owner<select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option value="all">All owners</option>{vehicleAdmins.map((owner) => <option value={owner.id} key={owner.id}>{owner.name}</option>)}</select></label><label><Filter size={14} /> Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label><span>Availability</span><select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value as Filter)}><option value="all">All availability</option><option value="available">Available</option><option value="unavailable">Unavailable</option></select></label></div></section>

            {loading ? <div className="vfa__state"><LoaderCircle className="vfa__spin" size={21} />Loading fleet availability...</div> : filteredVehicles.length === 0 ? <div className="vfa__state"><CarFront size={28} /><strong>No vehicles match these filters</strong><span>Try changing the date range or filters.</span></div> : <section className="vfa__list" aria-label="Fleet availability list">{filteredVehicles.map((vehicle) => <article className="vfa__vehicle" key={vehicle.id}><div className={`vfa__vehicle-icon vfa__vehicle-icon--${vehicle.availability}`}><CarFront size={20} /></div><div className="vfa__vehicle-main"><div className="vfa__vehicle-heading"><h2>{vehicle.name || vehicle.type || "Unnamed vehicle"}</h2><span className={`vfa__availability vfa__availability--${vehicle.availability}`}>{vehicle.availability}</span></div><p>{vehicle.registration_no || "No registration"} · {vehicle.seating_capacity || "-"} seats · {vehicle.model || "Model not provided"}</p><div className="vfa__vehicle-meta"><span><Users size={13} /> {vehicle.vehicle_admin?.name || "Unassigned"}</span><span><Wrench size={13} /> {vehicle.driver_name || "Driver not provided"}</span></div>{vehicle.calendars.length > 0 && <small>{vehicle.calendars.map((block) => `${block.status} ${formatDate(block.start_date.slice(0, 10))} - ${formatDate(block.end_date.slice(0, 10))}`).join(" · ")}</small>}</div><div className="vfa__vehicle-action"><Link to="/dashboard/vehicle-schedule" title="Open vehicle calendar"><ChevronRight size={18} /></Link></div></article>)}</section>}
        </main>
    );
};

export default VehicleAvailability;
