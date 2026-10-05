import { CalendarDays, CarFront, ClipboardList } from "lucide-react";
import "./VehicleBookings.css";

const VehicleBookings = () => (
    <main className="vbk">
        <header className="vbk__header">
            <div>
                <p className="vbk__eyebrow">Vehicle operations</p>
                <h1>Vehicle bookings</h1>
                <p>View bookings assigned to vehicles from one place.</p>
            </div>
            <div className="vbk__icon"><CarFront size={24} /></div>
        </header>

        <section className="vbk__empty">
            <div className="vbk__empty-icon"><ClipboardList size={30} /></div>
            <h2>Bookings will appear here</h2>
            <p>This page is ready for the vehicle booking list. It will show assigned vehicle, travel dates and booking status once the booking API is connected.</p>
            <div className="vbk__hint"><CalendarDays size={16} />Use the Vehicle Calendar to manage availability.</div>
        </section>
    </main>
);

export default VehicleBookings;
