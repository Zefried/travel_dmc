// Step 1 — imports

import { useState } from "react";
import "./TripProposal.css";

import { useItinerary } from "../../../Context/ItineraryContext";
import HotelSelection from "./HotelSelection";
import RoomSelection from "./RoomSelection";
import ActivitySelection from "./ActivitySelection";

type TripProposalProps = {
    onBack?: () => void;
};



// Step 3 — component

const TripProposal = ({
    onBack,
}: TripProposalProps) => {

    const { state, costs, setRoom, setHotel, removeActivity } = useItinerary();
    const [saved, setSaved] = useState(false);
    const [activityDayIndex, setActivityDayIndex] = useState<number | null>(null);

    const formatTime = (time: number) => {
        const hours = Math.floor(time);
        const mins = (time - hours) * 60;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        return `${displayHours}:${mins === 0 ? '00' : mins} ${ampm}`;
    };


    // Functions

    const formatDate = (
        dateString: string
    ) => {

        if (!dateString) {
            return "";
        }

        const date = new Date(
            `${dateString}T00:00:00`
        );

        return date.toLocaleDateString(
            "en-GB",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    const addDays = (
        dateString: string,
        days: number
    ) => {

        const date = new Date(
            `${dateString}T00:00:00`
        );

        date.setDate(
            date.getDate() + days
        );

        return date;
    };


    const formatDateObject = (
        date: Date
    ) => {

        return date.toLocaleDateString(
            "en-GB",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    const getTotalNights = () => {
        return state.nights;
    };

    const getEndDate = () => {
        if (!state.leavingOn) {
            return "";
        }
        return formatDateObject(
            addDays(state.leavingOn, state.nights)
        );
    };

    const getDestinationNames = () => {
        return state.city?.name || "Guwahati";
    };

    const buildTripDays = () => {
        return state.days.map((day, index) => {
            const isFirstDay = index === 0;
            const isLastDay = index === state.nights - 1;
            const city = state.city?.name || "Guwahati";

            return {
                dayNumber: day.dayNumber,
                index: index,
                date: formatDate(day.date),
                city: city,
                title: isFirstDay ? `Arrival in ${city}` : isLastDay ? `Explore ${city}` : `${city} Experience`,
                description: isFirstDay ? `Arrive in ${city} and settle into your accommodation. Enjoy the rest of the day at your own pace.` : `Enjoy a relaxed day exploring ${city}, with time for sightseeing, local experiences and leisure.`,
                activities: day.activities || [],
                availableSlots: day.availableSlots || [],
                transfer: isFirstDay ? `Private transfer to your hotel in ${city}` : undefined,
                overnight: state.hotel ? state.hotel.name : `${city} hotel`,
            };
        });
    };





    // Data

    const totalNights =
        getTotalNights();

    const tripDays =
        buildTripDays();

    const destinationNames =
        getDestinationNames();

    const endDate =
        getEndDate();


    // Handlers

    const handleSaveProposal = () => {

        setSaved(true);
    };


    // Return

    return (
        <div className="agentsearch-proposal-page">

            {/* HEADER */}

            <header className="agentsearch-proposal-header">

                <div className="agentsearch-proposal-header-inner">

                    <div>

                        <span className="agentsearch-proposal-eyebrow">
                            TRIP PROPOSAL
                        </span>

                        <h1 className="agentsearch-proposal-title">
                            Customize Your Trip
                        </h1>

                        <p className="agentsearch-proposal-meta">

                            {formatDate(
                                state.leavingOn
                            )}

                            {" · "}

                            {totalNights}{" "}
                            {totalNights === 1
                                ? "night"
                                : "nights"}

                            {" · "}

                            {state.travelers}

                        </p>

                    </div>


                    <div className="agentsearch-proposal-header-actions">

                        {onBack && (

                            <button
                                type="button"
                                className="agentsearch-proposal-back"
                                onClick={onBack}
                            >
                                ← Back
                            </button>

                        )}


                        <button
                            type="button"
                            className="agentsearch-update-button"
                        >
                            Update Trip Details
                        </button>

                    </div>

                </div>

            </header>


            {/* MAIN */}

            <main className="agentsearch-proposal-layout">

                {/* MAIN CONTENT */}

                <div className="agentsearch-proposal-main">

                    {!state.hotel ? (
                        <HotelSelection />
                    ) : !state.room ? (
                        <RoomSelection />
                    ) : (
                        <>
                            {/* ACCOMMODATION */}

                            <section className="agentsearch-proposal-card">

                                <div className="agentsearch-card-heading">

                                    <div>

                                        <span className="agentsearch-card-label">
                                            ACCOMMODATION
                                        </span>

                                        <h2>
                                            {destinationNames}
                                        </h2>

                                    </div>

                                </div>


                                <div className="agentsearch-hotel-card">

                                    <div className="agentsearch-hotel-image">

                                        <div className="agentsearch-hotel-placeholder">
                                            HOTEL
                                        </div>

                                    </div>


                                    <div className="agentsearch-hotel-content">

                                        <div className="agentsearch-hotel-rating">

                                            {state.hotel
                                                ? "★".repeat(
                                                    Number(
                                                        state.hotel.starRating
                                                    )
                                                )
                                                : "★★★★★"}

                                        </div>


                                        <h3>
                                            Recommended Hotel
                                        </h3>


                                        <p className="agentsearch-hotel-address">
                                            Accommodation will be selected based
                                            on your client's requirements.
                                        </p>


                                        <div className="agentsearch-hotel-score">

                                            <strong>
                                                {state.room ? `₹${state.room.pricePerNight}` : "—"}
                                            </strong>

                                            <div>

                                                <span>
                                                    {state.room ? state.room.roomName : "Awaiting selection"}
                                                </span>

                                                <small>
                                                    {state.room ? "Selected room" : "Hotel options available"}
                                                </small>

                                            </div>

                                        </div>


                                        <div className="agentsearch-hotel-dates">

                                            <div>

                                                <span>
                                                    Check-in
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        state.leavingOn
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Check-out
                                                </span>

                                                <strong>
                                                    {endDate}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="agentsearch-hotel-features">

                                            <p>
                                                ✓{" "}
                                                {state.travelers}
                                            </p>

                                            <p>
                                                ✓{" "}
                                                {state.hotel
                                                    ? `${state.hotel.starRating} star hotel preference`
                                                    : "Flexible hotel rating"}
                                            </p>

                                            <p>
                                                ✓{" "}
                                                Indian traveler
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            className="agentsearch-secondary-button"
                                            onClick={() => setRoom(null)}
                                        >
                                            Change Room
                                        </button>


                                        <button
                                            type="button"
                                            className="agentsearch-secondary-button"
                                            onClick={() => setHotel(null)}
                                        >
                                            Change Hotel
                                        </button>

                                    </div>

                                </div>

                            </section>


                            {/* ITINERARY */}

                            <section className="agentsearch-itinerary">

                                <div className="agentsearch-itinerary-heading">

                                    <span className="agentsearch-card-label">
                                        ITINERARY
                                    </span>

                                    <h2>
                                        Your Trip
                                    </h2>

                                    <p>
                                        A day-by-day overview of your client's journey.
                                    </p>

                                </div>


                                {tripDays.map(
                                    (tripDay) => (

                                        <article
                                            key={tripDay.dayNumber}
                                            className="agentsearch-day-card"
                                        >

                                            <div className="agentsearch-day-header">

                                                <div>

                                                    <span className="agentsearch-day-number">
                                                        DAY {tripDay.dayNumber}
                                                    </span>

                                                    <h3>
                                                        {tripDay.title}
                                                    </h3>

                                                    <p>
                                                        {tripDay.date}
                                                    </p>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="agentsearch-change-day"
                                                >
                                                    Change Day
                                                </button>

                                            </div>


                                            <div className="agentsearch-day-content">

                                                <p className="agentsearch-day-description">
                                                    {tripDay.description}
                                                </p>


                                                <div className="agentsearch-activities" style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                                                            {tripDay.availableSlots.length > 0 ? (
                                                                <><strong>Free Time:</strong> {tripDay.availableSlots.map(s => `${formatTime(s.start)} - ${formatTime(s.end)}`).join(", ")}</>
                                                            ) : (
                                                                <><strong>Free Time:</strong> None</>
                                                            )}
                                                        </span>

                                                        <button 
                                                            type="button" 
                                                            className="agentsearch-secondary-button"
                                                            onClick={() => setActivityDayIndex(tripDay.index)}
                                                        >
                                                            + Add Activity
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="agentsearch-day-activities" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                                    {tripDay.activities.map((activity) => (
                                                        <div
                                                            key={activity.id}
                                                            className="agentsearch-activity"
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px' }}
                                                        >
                                                            <div>
                                                                <span className="agentsearch-check">✓</span>
                                                                <strong>{activity.name}</strong> 
                                                                <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                                                    ({formatTime(activity.startTime)} - {formatTime(activity.startTime + activity.duration)} | {activity.duration} hr{activity.duration > 1 ? 's' : ''})
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <strong style={{ fontSize: '0.875rem' }}>₹{activity.price}</strong>
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeActivity(tripDay.index, activity.id)}
                                                                    style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '15px', fontWeight: 600, padding: '4px' }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {tripDay.activities.length > 0 && (
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 0 0 0', fontSize: '0.875rem', borderTop: '1px solid #e2e8f0', marginTop: '0.25rem' }}>
                                                            <strong>Day {tripDay.dayNumber} Activity Cost: ₹{costs.dailyCosts[tripDay.index]}</strong>
                                                        </div>
                                                    )}
                                                </div>


                                                {tripDay.transfer && (

                                                    <div className="agentsearch-transfer">

                                                        <span className="agentsearch-transfer-icon">
                                                            ⇄
                                                        </span>

                                                        <div>

                                                            <strong>
                                                                {tripDay.transfer}
                                                            </strong>

                                                            <p>
                                                                Private transfer
                                                            </p>

                                                        </div>

                                                    </div>

                                                )}


                                                <div className="agentsearch-meals">

                                                    <div>

                                                        <span>
                                                            ×
                                                        </span>

                                                        Lunch:{" "}
                                                        <strong>
                                                            Not Included
                                                        </strong>

                                                        <button type="button">
                                                            + Add
                                                        </button>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            ×
                                                        </span>

                                                        Dinner:{" "}
                                                        <strong>
                                                            Not Included
                                                        </strong>

                                                        <button type="button">
                                                            + Add
                                                        </button>

                                                    </div>

                                                </div>


                                                <div className="agentsearch-overnight">

                                                    <span>
                                                        🛏
                                                    </span>

                                                    Overnight at{" "}
                                                    {tripDay.overnight}

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </section>
                        </>
                    )}

                </div>


                {/* SIDEBAR */}

                <aside className="agentsearch-proposal-sidebar">

                    {/* PRICE SUMMARY */}

                    <section className="agentsearch-summary-card">

                        <div className="agentsearch-summary-heading">

                            <span className="agentsearch-card-label">
                                PRICE SUMMARY
                            </span>

                            <span className="agentsearch-summary-icon">
                                ₹
                            </span>

                        </div>


                        <div className="agentsearch-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span>Hotel ({totalNights} night{totalNights > 1 ? 's' : ''})</span>
                            <strong>₹{costs.hotelTotal}</strong>
                        </div>

                        <div className="agentsearch-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                            <span>Activities</span>
                            <strong>₹{costs.activitiesTotal}</strong>
                        </div>

                        <div className="agentsearch-summary-total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem' }}>
                            <span>Total Price</span>
                            <strong>₹{costs.grandTotal}</strong>
                        </div>


                        <button
                            type="button"
                            className="agentsearch-save-button"
                            onClick={handleSaveProposal}
                        >
                            {saved
                                ? "Proposal Saved"
                                : "Save As Proposal"}
                        </button>

                    </section>


                    {/* TRIP SUMMARY */}

                    <section className="agentsearch-summary-card">

                        <span className="agentsearch-card-label">
                            TRIP SUMMARY
                        </span>


                        <h2>
                            {destinationNames}
                        </h2>


                        <ul className="agentsearch-trip-summary">

                            <li>
                                {totalNights}{" "}
                                {totalNights === 1
                                    ? "night"
                                    : "nights"}
                            </li>


                            <li>
                                Departing from{" "}
                                "Not specified"
                            </li>


                            <li>
                                {state.travelers || "Not specified"}
                            </li>


                            {/* <li>
                                Nationality not in state
                            </li> */}


                            <li>
                                {state.hotel?.starRating
                                    ? `${state.hotel.starRating} star hotel preference`
                                    : "Flexible hotel rating"}
                            </li>


                            <li>
                                Transfers not included
                            </li>

                        </ul>

                    </section>

                </aside>

            </main>

            {/* Activity Selection Modal */}
            <ActivitySelection 
                isOpen={activityDayIndex !== null}
                dayIndex={activityDayIndex}
                onClose={() => setActivityDayIndex(null)}
            />

        </div>
    );
};


export default TripProposal;