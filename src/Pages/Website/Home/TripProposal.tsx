// Step 1 — imports

import { useState } from "react";
import "./TripProposal.css";

import type { CustomTripData } from "./CustomTripModal";


// Step 2 — types

type TripDay = {
    day: number;
    date: string;
    city: string;
    title: string;
    description: string;
    activities: string[];
    transfer?: string;
    overnight: string;
};


type TripProposalProps = {
    tripData: CustomTripData;
    onBack?: () => void;
};


// Step 3 — component

const TripProposal = ({
    tripData,
    onBack,
}: TripProposalProps) => {

    // State

    const [saved, setSaved] = useState(false);


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

        return tripData.destinations.reduce(
            (total, destination) =>
                total + destination.nights,
            0
        );
    };


    const getEndDate = () => {

        if (!tripData.leavingOn) {
            return "";
        }

        return formatDateObject(
            addDays(
                tripData.leavingOn,
                getTotalNights()
            )
        );
    };


    const getDestinationNames = () => {

        return tripData.destinations
            .map(
                (destination) =>
                    destination.city
            )
            .join(" → ");
    };


    const buildTripDays = (): TripDay[] => {

        const days: TripDay[] = [];

        let dayNumber = 1;

        let currentDate = tripData.leavingOn;


        tripData.destinations.forEach(
            (destination, destinationIndex) => {

                for (
                    let night = 0;
                    night < destination.nights;
                    night++
                ) {

                    const isFirstDay =
                        dayNumber === 1;

                    const isLastDay =
                        destinationIndex ===
                            tripData.destinations.length - 1 &&
                        night === destination.nights - 1;


                    days.push({

                        day: dayNumber,

                        date: currentDate
                            ? formatDate(currentDate)
                            : `Day ${dayNumber}`,

                        city: destination.city,

                        title:
                            isFirstDay
                                ? `Arrival in ${destination.city}`
                                : isLastDay
                                    ? `Explore ${destination.city}`
                                    : `${destination.city} Experience`,

                        description:
                            isFirstDay
                                ? `Arrive in ${destination.city} and settle into your accommodation. Enjoy the rest of the day at your own pace.`
                                : `Enjoy a relaxed day exploring ${destination.city}, with time for sightseeing, local experiences and leisure.`,

                        activities:
                            isFirstDay
                                ? [
                                    "Arrival and hotel check-in",
                                    `${destination.city} orientation`,
                                ]
                                : [
                                    `Explore ${destination.city}`,
                                    "Local sightseeing and experiences",
                                ],

                        transfer:
                            tripData.addTransfers && isFirstDay
                                ? `Private transfer to your hotel in ${destination.city}`
                                : undefined,

                        overnight:
                            `${destination.city} hotel`,
                    });


                    dayNumber++;


                    if (currentDate) {

                        const nextDate = addDays(
                            currentDate,
                            1
                        );

                        currentDate =
                            nextDate
                                .toISOString()
                                .split("T")[0];
                    }

                }

            }
        );


        return days;
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
                                tripData.leavingOn
                            )}

                            {" · "}

                            {totalNights}{" "}
                            {totalNights === 1
                                ? "night"
                                : "nights"}

                            {" · "}

                            {tripData.travelers}

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

                                    {tripData.starRating
                                        ? "★".repeat(
                                            Number(
                                                tripData.starRating
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
                                        —
                                    </strong>

                                    <div>

                                        <span>
                                            Awaiting selection
                                        </span>

                                        <small>
                                            Hotel options available
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
                                                tripData.leavingOn
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
                                        {tripData.travelers}
                                    </p>

                                    <p>
                                        ✓{" "}
                                        {tripData.starRating
                                            ? `${tripData.starRating} star hotel preference`
                                            : "Flexible hotel rating"}
                                    </p>

                                    <p>
                                        ✓{" "}
                                        {tripData.nationality} traveler
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="agentsearch-secondary-button"
                                >
                                    Change Room
                                </button>


                                <button
                                    type="button"
                                    className="agentsearch-secondary-button"
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
                                    key={tripDay.day}
                                    className="agentsearch-day-card"
                                >

                                    <div className="agentsearch-day-header">

                                        <div>

                                            <span className="agentsearch-day-number">
                                                DAY {tripDay.day}
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


                                        <div className="agentsearch-activities">

                                            <div className="agentsearch-activity-period">

                                                <span>
                                                    Morning
                                                </span>

                                                <button type="button">
                                                    + Add Activity
                                                </button>

                                            </div>


                                            <div className="agentsearch-activity-period">

                                                <span>
                                                    Afternoon
                                                </span>

                                                <button type="button">
                                                    + Add Activity
                                                </button>

                                            </div>


                                            <div className="agentsearch-activity-period">

                                                <span>
                                                    Evening
                                                </span>

                                                <button type="button">
                                                    + Add Activity
                                                </button>

                                            </div>

                                        </div>


                                        <div className="agentsearch-day-activities">

                                            {tripDay.activities.map(
                                                (activity) => (

                                                    <div
                                                        key={activity}
                                                        className="agentsearch-activity"
                                                    >

                                                        <span className="agentsearch-check">
                                                            ✓
                                                        </span>

                                                        {activity}

                                                    </div>

                                                )
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


                        <div className="agentsearch-summary-row">

                            <span>
                                Price per adult
                            </span>

                            <strong>
                                To be calculated
                            </strong>

                        </div>


                        <div className="agentsearch-summary-total">

                            <span>
                                Total Price
                            </span>

                            <strong>
                                To be calculated
                            </strong>

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
                                {tripData.leavingFrom ||
                                    "Not specified"}
                            </li>


                            <li>
                                {tripData.travelers}
                            </li>


                            <li>
                                {tripData.nationality}
                            </li>


                            <li>
                                {tripData.starRating
                                    ? `${tripData.starRating} star hotel preference`
                                    : "Flexible hotel rating"}
                            </li>


                            <li>
                                {tripData.addTransfers
                                    ? "Private transfers included"
                                    : "Transfers not included"}
                            </li>

                        </ul>

                    </section>

                </aside>

            </main>

        </div>
    );
};


export default TripProposal;