import { useEffect, useState } from "react";

import BookingDetails from "./Components/BookingDetails";
import Activities from "./Components/Activities";
import Summary from "./Components/Summary";

export interface Booking {
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

const PackageBuilderPage = () => {
  const [booking, setBooking] = useState<Booking>({
    state: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    hotelId: null,
    vehicleId: null,
    mealPlanId: null,
    pickupLocation: "",
    activityIds: [],
  });

  const [totalDays, setTotalDays] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  useEffect(() => {
    if (!booking.checkIn || !booking.checkOut) {
      setTotalDays(0);
      setTotalNights(0);
      return;
    }

    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    const difference = checkOut.getTime() - checkIn.getTime();

    if (difference <= 0) {
      setTotalDays(0);
      setTotalNights(0);
      return;
    }

    const nights = Math.floor(difference / (1000 * 60 * 60 * 24));

    setTotalNights(nights);
    setTotalDays(nights + 1);
  }, [booking.checkIn, booking.checkOut]);

  return (
    <div className="package-builder">
      <div className="package-builder-left">
        <BookingDetails booking={booking} setBooking={setBooking} />
      </div>

      <div className="package-builder-right">
        <Activities
          booking={booking}
          setBooking={setBooking}
          totalNights={totalNights}
        />
      </div>

      <div className="package-builder-summary">
        <Summary
          booking={booking}
          totalDays={totalDays}
          totalNights={totalNights}
        />
      </div>
    </div>
  );
};

export default PackageBuilderPage;
