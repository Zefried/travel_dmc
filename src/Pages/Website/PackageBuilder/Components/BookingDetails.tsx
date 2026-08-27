import React from "react";
import {
  CalendarDays,
  Users,
  Hotel,
  Car,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";

import "../../Styles/BookingDetails.css";

interface Booking {
  state: string;
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

interface BookingDetailsProps {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
}

const hotels = [
  { id: 1, name: "⭐⭐ 2 Star" },
  { id: 2, name: "⭐⭐⭐ 3 Star" },
  { id: 3, name: "⭐⭐⭐⭐ 4 Star" },
  { id: 4, name: "⭐⭐⭐⭐⭐ 5 Star" },
];

const vehicles = [
  { id: 1, name: "Sedan" },
  { id: 2, name: "SUV" },
  { id: 3, name: "Tempo Traveller" },
];

const mealPlans = [
  { id: 1, name: "Breakfast" },
  { id: 2, name: "Breakfast + Dinner" },
  { id: 3, name: "All Meals" },
];

const states = [
  { id: 1, name: "Assam" },
  { id: 2, name: "Meghalaya" },
  { id: 3, name: "Arunachal Pradesh" },
  { id: 4, name: "Nagaland" },
  { id: 5, name: "Manipur" },
  { id: 6, name: "Mizoram" },
  { id: 7, name: "Tripura" },
  { id: 8, name: "Sikkim" },
  { id: 9, name: "Bhutan" },
];

const pickupLocations = [
  "Guwahati Airport",
  "Guwahati Railway Station",
  "Khanapara",
];

const BookingDetails = ({ booking, setBooking }: BookingDetailsProps) => {
  const updateField = (key: keyof Booking, value: any) => {
    setBooking((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <div className="bkd-container">
      <div className="bkd-header">
        <h2 className="bkd-title">Booking Details</h2>

        <p className="bkd-subtitle">Customize your Northeast trip</p>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <CalendarDays size={18} />
          <span>Travel Dates</span>
        </h3>

        <div className="bkd-grid">
          <div className="bkd-field">
            <label className="bkd-label">Check In</label>

            <input
              className="bkd-input"
              type="date"
              value={booking.checkIn}
              onChange={(e) => updateField("checkIn", e.target.value)}
            />
          </div>

          <div className="bkd-field">
            <label className="bkd-label">Check Out</label>

            <input
              className="bkd-input"
              type="date"
              value={booking.checkOut}
              onChange={(e) => updateField("checkOut", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <Users size={18} />
          <span>Travellers</span>
        </h3>

        <div className="bkd-grid">
          <div className="bkd-field">
            <label className="bkd-label">Adults</label>

            <input
              className="bkd-input"
              type="number"
              min={1}
              value={booking.adults}
              onChange={(e) => updateField("adults", Number(e.target.value))}
            />
          </div>

          <div className="bkd-field">
            <label className="bkd-label">Children</label>

            <input
              className="bkd-input"
              type="number"
              min={0}
              value={booking.children}
              onChange={(e) => updateField("children", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="bkd-field bkd-state-field">
        <label className="bkd-label">State</label>

        <select
          className="bkd-select"
          value={booking.state}
          onChange={(e) => updateField("state", e.target.value)}
        >
          <option value="">Select State</option>

          {states.map((state) => (
            <option key={state.id} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <Hotel size={18} />
          <span>Hotel Category</span>
        </h3>

        <select
          className="bkd-select"
          value={booking.hotelId ?? ""}
          onChange={(e) => updateField("hotelId", Number(e.target.value))}
        >
          <option value="">Select Hotel Category</option>

          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <Car size={18} />
          <span>Vehicle</span>
        </h3>

        <select
          className="bkd-select"
          value={booking.vehicleId ?? ""}
          onChange={(e) => updateField("vehicleId", Number(e.target.value))}
        >
          <option value="">Select Vehicle</option>

          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <UtensilsCrossed size={18} />
          <span>Meal Plan</span>
        </h3>

        <select
          className="bkd-select"
          value={booking.mealPlanId ?? ""}
          onChange={(e) => updateField("mealPlanId", Number(e.target.value))}
        >
          <option value="">Select Meal Plan</option>

          {mealPlans.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bkd-section">
        <h3 className="bkd-section-title">
          <MapPin size={18} />
          <span>Pickup Location</span>
        </h3>

        <select
          className="bkd-select"
          value={booking.pickupLocation}
          onChange={(e) => updateField("pickupLocation", e.target.value)}
        >
          <option value="">Select Pickup Location</option>

          {pickupLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BookingDetails;
