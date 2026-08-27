import { useMemo } from "react";
import {
  CalendarDays,
  Users,
  Hotel,
  Car,
  UtensilsCrossed,
  MapPinned,
  Receipt,
  CreditCard,
} from "lucide-react";

import '../../Styles/Summary.css';

interface Booking {
    state:string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  hotelId: number | null;
  vehicleId: number | null;
  mealPlanId: number | null;
  pickupLocation: string;
  activityIds: number[];
}

interface SummaryProps {
  booking: Booking;
  totalDays: number;
  totalNights: number;
}

const hotels = [
  { id: 1, name: "2 Star", price: 1800 },
  { id: 2, name: "3 Star", price: 2600 },
  { id: 3, name: "4 Star", price: 4200 },
  { id: 4, name: "5 Star", price: 7000 },
];

const vehicles = [
  { id: 1, name: "Sedan", price: 2500 },
  { id: 2, name: "SUV", price: 4500 },
  { id: 3, name: "Tempo Traveller", price: 7000 },
];

const mealPlans = [
  { id: 1, name: "Breakfast", price: 250 },
  { id: 2, name: "Breakfast + Dinner", price: 500 },
  { id: 3, name: "All Meals", price: 900 },
];

const activities = [
  { id: 1, name: "Kamakhya Temple", price: 500 },
  { id: 2, name: "River Cruise", price: 1200 },
  { id: 3, name: "Pobitora Safari", price: 2500 },
  { id: 4, name: "Kaziranga Safari", price: 3500 },
  { id: 5, name: "Majuli Island", price: 4000 },
];

const Summary = ({ booking, totalDays, totalNights }: SummaryProps) => {
  const travellers = booking.adults + booking.children;

  const hotel = hotels.find((h) => h.id === booking.hotelId);

  const vehicle = vehicles.find((v) => v.id === booking.vehicleId);

  const meal = mealPlans.find((m) => m.id === booking.mealPlanId);

  const hotelPrice = useMemo(() => {
    if (!hotel) return 0;

    return hotel.price * totalNights;
  }, [hotel, totalNights]);

  const vehiclePrice = useMemo(() => {
    if (!vehicle) return 0;

    return vehicle.price * totalDays;
  }, [vehicle, totalDays]);

  const mealPrice = useMemo(() => {
    if (!meal) return 0;

    return meal.price * travellers * totalDays;
  }, [meal, travellers, totalDays]);

  const activityPrice = useMemo(() => {
    return booking.activityIds.reduce((total, id) => {
      const activity = activities.find((a) => a.id === id);

      return total + (activity?.price ?? 0);
    }, 0);
  }, [booking.activityIds]);

  const grandTotal = hotelPrice + vehiclePrice + mealPrice + activityPrice;

  const handleBooking = () => {
    alert("Booking Submitted (Demo)");
  };

  return (
    <div className="sum-container">
      <div className="sum-header">
        <h2 className="sum-title">
          <Receipt size={22} />
          Price Summary
        </h2>

        <p className="sum-subtitle">Review your trip before booking.</p>
      </div>

      <div className="sum-trip-info">
        <div className="sum-info">
          <CalendarDays size={18} />

          <span>
            {totalDays} Days / {totalNights} Nights
          </span>
        </div>

        <div className="sum-info">
          <Users size={18} />

          <span>{travellers} Travellers</span>
        </div>

        <div className="sum-info">
          <Hotel size={18} />

          <span>{hotel?.name ?? "-"}</span>
        </div>

        <div className="sum-info">
          <Car size={18} />

          <span>{vehicle?.name ?? "-"}</span>
        </div>

        <div className="sum-info">
          <UtensilsCrossed size={18} />

          <span>{meal?.name ?? "-"}</span>
        </div>

        <div className="sum-info">
          <MapPinned size={18} />

          <span>{booking.activityIds.length} Activities</span>
        </div>
      </div>

      <div className="sum-divider"></div>

      <div className="sum-price-list">
        <div className="sum-row">
          <span>Hotel</span>

          <strong>₹{hotelPrice.toLocaleString()}</strong>
        </div>

        <div className="sum-row">
          <span>Vehicle</span>

          <strong>₹{vehiclePrice.toLocaleString()}</strong>
        </div>

        <div className="sum-row">
          <span>Meals</span>

          <strong>₹{mealPrice.toLocaleString()}</strong>
        </div>

        <div className="sum-row">
          <span>Activities</span>

          <strong>₹{activityPrice.toLocaleString()}</strong>
        </div>
      </div>

      <div className="sum-divider"></div>

      <div className="sum-total-card">
        <span className="sum-total-label">Grand Total</span>

        <h2 className="sum-total-price">₹{grandTotal.toLocaleString()}</h2>

        <p className="sum-total-note">Taxes & service charges included.</p>
      </div>

      <button className="sum-book-btn" onClick={handleBooking}>
        <CreditCard size={18} />

        <span>Book Now</span>
      </button>
    </div>
  );
};

export default Summary;
