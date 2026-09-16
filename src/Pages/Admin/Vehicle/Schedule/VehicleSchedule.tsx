import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, CarFront, CheckCircle2, Edit3, Filter, LoaderCircle, Search, Trash2 } from "lucide-react";
import api from "../../../../api/axios";
import "./VehicleSchedule.css";

type Vehicle = {
    id: number;
    name: string | null;
    type: string | null;
    registration_no: string | null;
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

type StatusFilter = "all" | "busy" | "maintenance" | "available";

const getErrorMessage = (error: any, fallback: string) => error?.response?.data?.message || fallback;

const formatDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const VehicleSchedule = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
    const [vehicleFilter, setVehicleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [removingId, setRemovingId] = useState<number | null>(null);

    const vehicleNames = useMemo(() => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])), [vehicles]);

    const loadSchedule = async () => {
        setLoading(true);
        setError("");
        try {
            const [vehicleResponse, blockResponse] = await Promise.all([
                api.get("/vehicle/list", { params: { per_page: 100 } }),
                api.get("/vehicle/calendar/list"),
            ]);
            const vehiclePayload = vehicleResponse.data?.data;
            const vehicleList = Array.isArray(vehiclePayload) ? vehiclePayload : vehiclePayload?.data || [];
            setVehicles(vehicleList);
            setBlocks(blockResponse.data?.data || []);
        } catch (requestError) {
            setError(getErrorMessage(requestError, "Could not load your vehicle schedule."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSchedule();
    }, []);

    const visibleBlocks = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return blocks
            .filter((block) => block.is_active)
            .filter((block) => vehicleFilter === "all" || String(block.vehicle_id) === vehicleFilter)
            .filter((block) => statusFilter === "all" || block.status === statusFilter)
            .filter((block) => {
                if (!normalizedSearch) return true;
                const vehicle = vehicleNames.get(block.vehicle_id);
                return [vehicle?.name, vehicle?.registration_no, block.notes, block.title]
                    .filter(Boolean)
                    .some((value) => value?.toLowerCase().includes(normalizedSearch));
            })
            .sort((first, second) => first.start_date.localeCompare(second.start_date));
    }, [blocks, search, statusFilter, vehicleFilter, vehicleNames]);

    const handleRemove = async (block: CalendarBlock) => {
        const vehicle = vehicleNames.get(block.vehicle_id);
        if (!window.confirm(`Remove the busy period for ${vehicle?.name || "this vehicle"}?`)) return;

        setRemovingId(block.id);
        setError("");
        setSuccess("");
        try {
            const response = await api.delete(`/vehicle/calendar/${block.id}`);
            setBlocks((current) => current.filter((item) => item.id !== block.id));
            setSuccess(response.data?.message || "Vehicle calendar entry removed successfully.");
        } catch (requestError) {
            setError(getErrorMessage(requestError, "Could not remove this calendar entry."));
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <main className="vsch">
            <header className="vsch__header">
                <div>
                    <p className="vsch__eyebrow">Vehicle operations</p>
                    <h1 className="vsch__title">View schedule</h1>
                    <p className="vsch__subtitle">Review and manage busy periods across your vehicles.</p>
                </div>
                <div className="vsch__summary"><CalendarDays size={17} /><strong>{blocks.filter((block) => block.is_active).length}</strong><span>active blocks</span></div>
            </header>

            {error && <div className="vsch__message vsch__message--error"><AlertCircle size={17} />{error}</div>}
            {success && <div className="vsch__message vsch__message--success"><CheckCircle2 size={17} />{success}</div>}

            <section className="vsch__filters">
                <div className="vsch__search"><Search size={16} /><input aria-label="Search schedule" placeholder="Search vehicle or note" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
                <div className="vsch__filter-row"><label><Filter size={14} /><span>Vehicle</span><select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)}><option value="all">All vehicles</option>{vehicles.map((vehicle) => <option value={vehicle.id} key={vehicle.id}>{vehicle.name || vehicle.type || "Unnamed vehicle"}</option>)}</select></label><label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="all">All statuses</option><option value="busy">Busy</option><option value="maintenance">Maintenance</option><option value="available">Available</option></select></label></div>
            </section>

            {loading ? <div className="vsch__state"><LoaderCircle className="vsch__spin" size={20} /><span>Loading your schedule...</span></div> : visibleBlocks.length === 0 ? <div className="vsch__state"><CalendarDays size={28} /><strong>{blocks.length ? "No matching schedule blocks" : "No busy periods yet"}</strong><span>{blocks.length ? "Try changing your filters." : "Busy periods created from Vehicle Calendar will appear here."}</span></div> : (
                <section className="vsch__list" aria-label="Vehicle schedule blocks">
                    {visibleBlocks.map((block) => {
                        const vehicle = vehicleNames.get(block.vehicle_id);
                        return <article className="vsch__item" key={block.id}>
                            <div className={`vsch__vehicle-icon vsch__vehicle-icon--${block.status}`}><CarFront size={19} /></div>
                            <div className="vsch__item-main"><div className="vsch__item-title"><h2>{vehicle?.name || vehicle?.type || "Unnamed vehicle"}</h2><span className={`vsch__status vsch__status--${block.status}`}>{block.status}</span></div><p>{vehicle?.registration_no || "Registration not provided"}</p><strong>{formatDate(block.start_date)} <span>to</span> {formatDate(block.end_date)}</strong><small>{block.notes || block.title || "No notes added"}</small></div>
                            <div className="vsch__item-actions"><button type="button" onClick={() => { window.location.href = `/dashboard/vehicle-schedule?edit=${block.id}`; }} title="Edit this period"><Edit3 size={16} /><span>Edit</span></button><button type="button" onClick={() => void handleRemove(block)} disabled={removingId === block.id} title="Remove this period">{removingId === block.id ? <LoaderCircle className="vsch__spin" size={16} /> : <Trash2 size={16} />}<span>Remove</span></button></div>
                        </article>;
                    })}
                </section>
            )}
        </main>
    );
};

export default VehicleSchedule;
