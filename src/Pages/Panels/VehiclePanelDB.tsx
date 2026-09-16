import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import "./Styles/VehiclePanelDB.css";

type VehicleStatus = "Active" | "Inactive";
type VehicleFilter = "All" | VehicleStatus;
type DemoState = "ready" | "loading" | "empty" | "error";

type Vehicle = {
  name: string;
  detail: string;
  status: VehicleStatus;
  statusNote: string;
  tone: "green" | "amber";
};

const stats = [
  { label: "Total vehicles", value: "12", detail: "Across your fleet", icon: CarFront, tone: "blue" },
  { label: "Active", value: "9", detail: "Ready for assignments", icon: CheckCircle2, tone: "green" },
  { label: "Inactive", value: "3", detail: "Needs attention", icon: Clock3, tone: "amber" },
  { label: "Pending requests", value: "2", detail: "Waiting for a response", icon: Bell, tone: "orange" },
];

const schedule = [
  { time: "10:00 AM", vehicle: "Toyota Innova", route: "Airport Pickup", location: "Guwahati Airport", color: "blue" },
  { time: "3:30 PM", vehicle: "Ertiga", route: "Guwahati → Shillong", location: "Paltan Bazaar", color: "coral" },
];

const requests = [
  { vehicle: "Innova", date: "18 Sep", route: "Airport → Hotel", requester: "Rohan Mehta" },
  { vehicle: "Swift", date: "20 Sep", route: "City Trip", requester: "North East Tours" },
];

const vehicles: Vehicle[] = [
  { name: "Toyota Innova", detail: "AS 01 AB 2841 · 7 seats", status: "Active", statusNote: "Next trip today, 10:00 AM", tone: "green" },
  { name: "Ertiga", detail: "AS 01 CD 7612 · 6 seats", status: "Active", statusNote: "Next trip today, 3:30 PM", tone: "green" },
  { name: "Swift", detail: "AS 01 EF 9083 · 5 seats", status: "Inactive", statusNote: "Maintenance · Return 21 Sep", tone: "amber" },
  { name: "Toyota Rumion", detail: "AS 01 GH 1146 · 7 seats", status: "Active", statusNote: "Available today", tone: "green" },
  { name: "Scorpio", detail: "AS 01 JK 4420 · 7 seats", status: "Active", statusNote: "Available tomorrow", tone: "green" },
];

const SectionHeader = ({ eyebrow, title, count, action }: { eyebrow: string; title: string; count?: string; action?: React.ReactNode }) => (
  <div className="vdb__section-header">
    <div>
      <p className="vdb__eyebrow">{eyebrow}</p>
      <h2 className="vdb__section-title">{title} {count && <span>{count}</span>}</h2>
    </div>
    {action}
  </div>
);

const StateMessage = ({ state }: { state: DemoState }) => {
  if (state === "ready") return null;

  return (
    <div className={`vdb__state-message vdb__state-message--${state}`}>
      {state === "loading" && <RefreshCw size={15} className="vdb__spin" />}
      {state === "loading" && "Loading vehicle activity..."}
      {state === "empty" && "No vehicle activity to show yet."}
      {state === "error" && "We could not load the latest activity. Try again."}
    </div>
  );
};

const VehiclePanelDB = () => {
  const [alertVisible, setAlertVisible] = useState(true);
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("All");
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>("ready");

  const filteredVehicles = vehicleFilter === "All"
    ? vehicles
    : vehicles.filter((vehicle) => vehicle.status === vehicleFilter);
  const visibleVehicles = showAllVehicles ? filteredVehicles : filteredVehicles.slice(0, 3);

  return (
    <main className="vdb">
      <header className="vdb__header">
        <div>
          <p className="vdb__eyebrow">Vehicle operations</p>
          <h1 className="vdb__title">Good morning, Arjun</h1>
          <p className="vdb__date">Wednesday, 16 September 2026</p>
        </div>
        <button className="vdb__icon-button" aria-label="View notifications" title="Notifications">
          <Bell size={19} />
          <span className="vdb__notification-dot" />
        </button>
      </header>

      {alertVisible && (
        <section className="vdb__priority" aria-label="Priority action">
          <div className="vdb__priority-icon"><AlertTriangle size={21} /></div>
          <div className="vdb__priority-content">
            <div className="vdb__priority-topline">
              <p className="vdb__eyebrow">Priority action</p>
              <button className="vdb__dismiss" onClick={() => setAlertVisible(false)}>Dismiss</button>
            </div>
            <h2>One booking needs attention</h2>
            <p><strong>Innova · 19 Sep</strong> · Vehicle reassignment may be needed.</p>
            <button className="vdb__action-link">Review priority cases <ArrowRight size={15} /></button>
          </div>
        </section>
      )}

      <div className="vdb__action-grid">
        <section className="vdb__panel vdb__panel--requests">
          <SectionHeader eyebrow="Needs a response" title="Pending requests" count="2" action={<span className="vdb__attention-dot" />} />
          <div className="vdb__request-list">
            {requests.map((request) => (
              <article className="vdb__request" key={`${request.vehicle}-${request.date}`}>
                <div className="vdb__request-icon"><CarFront size={17} /></div>
                <div className="vdb__request-copy">
                  <h3>{request.vehicle} <span>· {request.date}</span></h3>
                  <p>{request.route}</p>
                  <span className="vdb__meta"><UserRound size={13} /> {request.requester}</span>
                </div>
                <button className="vdb__review-button">Review <ArrowRight size={14} /></button>
              </article>
            ))}
          </div>
          <button className="vdb__action-link">View all requests <ArrowRight size={15} /></button>
        </section>

        <section className="vdb__panel vdb__panel--schedule">
          <SectionHeader eyebrow="Wednesday, 16 September" title="Today's schedule" action={<button className="vdb__quiet-button" aria-label="Open calendar" title="Open calendar"><CalendarDays size={18} /></button>} />
          <div className="vdb__timeline">
            {schedule.map((item) => (
              <article className="vdb__schedule-item" key={item.time}>
                <time className="vdb__schedule-time">{item.time}</time>
                <div className={`vdb__schedule-marker vdb__schedule-marker--${item.color}`} />
                <div className="vdb__schedule-copy">
                  <div className="vdb__schedule-title"><h3>{item.vehicle}</h3><span className="vdb__confirmed"><Check size={12} /> Confirmed</span></div>
                  <p>{item.route}</p>
                  <span className="vdb__meta"><MapPin size={13} /> {item.location}</span>
                </div>
              </article>
            ))}
          </div>
          <button className="vdb__action-link">Open today&apos;s schedule <ArrowRight size={15} /></button>
        </section>
      </div>

      <section className="vdb__panel vdb__fleet-panel">
        <SectionHeader
          eyebrow="Availability at a glance"
          title="My vehicles"
          count="12"
          action={<div className="vdb__filter-tabs" aria-label="Filter vehicles">{(["All", "Active", "Inactive"] as VehicleFilter[]).map((filter) => <button className={vehicleFilter === filter ? "vdb__filter-tab vdb__filter-tab--selected" : "vdb__filter-tab"} key={filter} onClick={() => { setVehicleFilter(filter); setShowAllVehicles(false); }}>{filter}</button>)}</div>}
        />
        <div className="vdb__vehicle-list">
          {visibleVehicles.map((vehicle) => (
            <article className="vdb__vehicle" key={vehicle.name}>
              <div className={`vdb__vehicle-icon vdb__vehicle-icon--${vehicle.tone}`}><CarFront size={19} /></div>
              <div className="vdb__vehicle-copy"><h3>{vehicle.name}</h3><p>{vehicle.detail}</p><span className="vdb__meta">{vehicle.statusNote}</span></div>
              <span className={`vdb__status vdb__status--${vehicle.status.toLowerCase()}`}>{vehicle.status}</span>
              <button className="vdb__vehicle-arrow" aria-label={`Open ${vehicle.name}`} title={`Open ${vehicle.name}`}><ArrowRight size={17} /></button>
            </article>
          ))}
          {visibleVehicles.length === 0 && <p className="vdb__empty">No vehicles match this filter.</p>}
        </div>
        {filteredVehicles.length > 3 && <button className="vdb__action-link" onClick={() => setShowAllVehicles((current) => !current)}>{showAllVehicles ? "Show fewer vehicles" : "View all vehicles"} <ArrowRight size={15} /></button>}
      </section>

      <section className="vdb__upcoming">
        <div><p className="vdb__eyebrow">Coming up</p><h2>Upcoming bookings</h2><p>Four confirmed trips scheduled over the next seven days.</p></div>
        <strong>4</strong>
      </section>

      <section className="vdb__overview" aria-label="Fleet overview">
        <div className="vdb__overview-heading"><div><p className="vdb__eyebrow">Fleet overview</p><p className="vdb__overview-note">A quick pulse on your vehicles.</p></div><SlidersHorizontal size={17} /></div>
        <div className="vdb__stats">{stats.map(({ label, value, detail, icon: Icon, tone }) => <article className={`vdb__stat vdb__stat--${tone}`} key={label}><div className="vdb__stat-icon"><Icon size={17} /></div><div><p className="vdb__stat-label">{label}</p><strong className="vdb__stat-value">{value}</strong><p className="vdb__stat-detail">{detail}</p></div></article>)}</div>
      </section>

      <details className="vdb__prototype">
        <summary><span><SlidersHorizontal size={15} /> Preview dashboard states</span><ChevronDown size={15} /></summary>
        <div className="vdb__prototype-body"><p>Development-only controls for testing loading, empty, and error states.</p><div className="vdb__prototype-actions">{(["ready", "loading", "empty", "error"] as DemoState[]).map((state) => <button className={demoState === state ? "vdb__prototype-button vdb__prototype-button--selected" : "vdb__prototype-button"} key={state} onClick={() => setDemoState(state)}>{state}</button>)}</div><StateMessage state={demoState} /></div>
      </details>
    </main>
  );
};

export default VehiclePanelDB;
