import React from "react";
import {
  Landmark,
  Ship,
  Trees,
  Bird,
  Mountain,
  CheckCircle2,
} from "lucide-react";

import '../../Styles/Activities.css';

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

interface Activity {
  id: number;
  name: string;
  minimumNights: number;
  price: number;
  icon: React.ReactNode;
}

interface ActivitiesProps {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  totalNights: number;
}

const activities: Activity[] = [
  {
    id: 1,
    name: "Kamakhya Temple",
    minimumNights: 1,
    price: 500,
    icon: <Landmark size={22} />,
  },

  {
    id: 2,
    name: "Brahmaputra River Cruise",
    minimumNights: 1,
    price: 1200,
    icon: <Ship size={22} />,
  },

  {
    id: 3,
    name: "Pobitora Safari",
    minimumNights: 2,
    price: 2500,
    icon: <Trees size={22} />,
  },

  {
    id: 4,
    name: "Kaziranga Safari",
    minimumNights: 3,
    price: 3500,
    icon: <Bird size={22} />,
  },

  {
    id: 5,
    name: "Majuli Island",
    minimumNights: 4,
    price: 4000,
    icon: <Mountain size={22} />,
  },
];

const Activities = ({ booking, setBooking, totalNights }: ActivitiesProps) => {
  const availableActivities = activities.filter(
    (activity) => activity.minimumNights <= totalNights,
  );

  const toggleActivity = (activityId: number) => {
    const selected = booking.activityIds.includes(activityId);

    if (selected) {
      setBooking((previous) => ({
        ...previous,

        activityIds: previous.activityIds.filter((id) => id !== activityId),
      }));

      return;
    }

    setBooking((previous) => ({
      ...previous,

      activityIds: [...previous.activityIds, activityId],
    }));
  };

  return (
    <div className="act-container">
      <div className="act-header">
        <h2 className="act-title">Activities</h2>

        <p className="act-subtitle">
          Select experiences to personalize your trip.
        </p>
      </div>

      {availableActivities.length === 0 ? (
        <div className="act-empty">
          <p>No activities are available for the selected trip duration.</p>
        </div>
      ) : (
        <div className="act-grid">
          {availableActivities.map((activity) => {
            const selected = booking.activityIds.includes(activity.id);

            return (
              <div
                key={activity.id}
                className={`act-card ${selected ? "act-selected" : ""}`}
                onClick={() => toggleActivity(activity.id)}
              >
                <div className="act-card-top">
                  <div className="act-icon">{activity.icon}</div>

                  {selected && (
                    <div className="act-check">
                      <CheckCircle2 size={22} />
                    </div>
                  )}
                </div>

                <h3 className="act-name">{activity.name}</h3>

                <div className="act-meta">
                  <span className="act-night">
                    {activity.minimumNights} Night
                    {activity.minimumNights > 1 ? "s" : ""} Min
                  </span>

                  <span className="act-price">
                    ₹{activity.price.toLocaleString()}
                  </span>
                </div>

                <p className="act-description">
                  Explore this destination during your Assam journey with a
                  guided experience.
                </p>

                <button type="button" className="act-button">
                  {selected ? "Selected" : "Select Activity"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activities;
