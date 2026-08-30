// Step 1 — imports

import { useState } from "react";
import "./CustomTripModal.css";


// Step 2 — types

export type Destination = {
    id: number;
    city: string;
    nights: number;
};


export type CustomTripData = {
    destinations: Destination[];
    leavingFrom: string;
    nationality: string;
    leavingOn: string;
    travelers: string;
    starRating: string;
    addTransfers: boolean;
};


type CustomTripModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateProposal: (data: CustomTripData) => void;
};


// Step 3 — component

const CustomTripModal = ({
    isOpen,
    onClose,
    onCreateProposal,
}: CustomTripModalProps) => {

    // State

    const [destinations, setDestinations] = useState<Destination[]>([
        {
            id: 1,
            city: "",
            nights: 1,
        },
    ]);

    const [leavingFrom, setLeavingFrom] = useState("");
    const [nationality, setNationality] = useState("India");
    const [leavingOn, setLeavingOn] = useState("");
    const [travelers, setTravelers] = useState("2 adults");
    const [starRating, setStarRating] = useState("");
    const [addTransfers, setAddTransfers] = useState(true);


    // Functions

    const addDestination = () => {

        setDestinations((current) => [
            ...current,
            {
                id: Date.now(),
                city: "",
                nights: 1,
            },
        ]);
    };


    const removeDestination = (
        id: number
    ) => {

        setDestinations((current) =>
            current.filter(
                (destination) =>
                    destination.id !== id
            )
        );
    };


    const updateDestination = (
        id: number,
        field: "city" | "nights",
        value: string | number
    ) => {

        setDestinations((current) =>
            current.map((destination) =>
                destination.id === id
                    ? {
                        ...destination,
                        [field]: value,
                    }
                    : destination
            )
        );
    };


    // Handlers

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        const tripData: CustomTripData = {

            destinations: destinations.filter(
                (destination) =>
                    destination.city.trim() !== ""
            ),

            leavingFrom,
            nationality,
            leavingOn,
            travelers,
            starRating,
            addTransfers,
        };


        if (tripData.destinations.length === 0) {
            return;
        }


        onCreateProposal(tripData);
    };


    if (!isOpen) {
        return null;
    }


    // Return

    return (
        <div className="agentsearch-modal-overlay">

            <div
                className="agentsearch-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="agentsearch-modal-title"
            >

                {/* Header */}

                <div className="agentsearch-modal-header">

                    <div>

                        <span className="agentsearch-modal-eyebrow">
                            CUSTOM ITINERARY
                        </span>

                        <h2
                            id="agentsearch-modal-title"
                            className="agentsearch-modal-title"
                        >
                            Create Your Trip
                        </h2>

                        <p className="agentsearch-modal-subtitle">
                            Build a personalized itinerary for your client.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="agentsearch-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* Destinations */}

                    <section className="agentsearch-modal-section">

                        <div className="agentsearch-section-heading">

                            <div>

                                <span className="agentsearch-section-number">
                                    01
                                </span>

                                <div>

                                    <h3 className="agentsearch-section-title">
                                        Destinations
                                    </h3>

                                    <p className="agentsearch-section-description">
                                        Add the cities your client wants to visit.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="agentsearch-destinations">

                            {destinations.map(
                                (destination, index) => (

                                    <div
                                        key={destination.id}
                                        className="agentsearch-destination"
                                    >

                                        <div className="agentsearch-destination-index">
                                            {index + 1}
                                        </div>


                                        <div className="agentsearch-modal-field agentsearch-destination-city">

                                            <label>
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                value={destination.city}
                                                onChange={(e) =>
                                                    updateDestination(
                                                        destination.id,
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter city name"
                                                required
                                            />

                                        </div>


                                        <div className="agentsearch-modal-field agentsearch-destination-nights">

                                            <label>
                                                Nights
                                            </label>

                                            <select
                                                value={destination.nights}
                                                onChange={(e) =>
                                                    updateDestination(
                                                        destination.id,
                                                        "nights",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >

                                                <option value={1}>
                                                    1 night
                                                </option>

                                                <option value={2}>
                                                    2 nights
                                                </option>

                                                <option value={3}>
                                                    3 nights
                                                </option>

                                                <option value={4}>
                                                    4 nights
                                                </option>

                                                <option value={5}>
                                                    5 nights
                                                </option>

                                                <option value={6}>
                                                    6 nights
                                                </option>

                                                <option value={7}>
                                                    7 nights
                                                </option>

                                            </select>

                                        </div>


                                        {destinations.length > 1 && (

                                            <button
                                                type="button"
                                                className="agentsearch-remove-destination"
                                                onClick={() =>
                                                    removeDestination(
                                                        destination.id
                                                    )
                                                }
                                                aria-label="Remove destination"
                                            >
                                                ×
                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>


                        <button
                            type="button"
                            className="agentsearch-add-destination"
                            onClick={addDestination}
                        >
                            + Add Another City
                        </button>

                    </section>


                    {/* Trip Details */}

                    <section className="agentsearch-modal-section">

                        <div className="agentsearch-section-heading">

                            <div>

                                <span className="agentsearch-section-number">
                                    02
                                </span>

                                <div>

                                    <h3 className="agentsearch-section-title">
                                        Trip Details
                                    </h3>

                                    <p className="agentsearch-section-description">
                                        Tell us a little about the trip.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="agentsearch-modal-grid">

                            {/* Leaving From */}

                            <div className="agentsearch-modal-field">

                                <label htmlFor="agentsearch-leaving-from">
                                    Leaving From
                                </label>

                                <input
                                    id="agentsearch-leaving-from"
                                    type="text"
                                    value={leavingFrom}
                                    onChange={(e) =>
                                        setLeavingFrom(e.target.value)
                                    }
                                    placeholder="e.g. Guwahati"
                                />

                            </div>


                            {/* Nationality */}

                            <div className="agentsearch-modal-field">

                                <label htmlFor="agentsearch-nationality">
                                    Nationality
                                    <span>*</span>
                                </label>

                                <select
                                    id="agentsearch-nationality"
                                    value={nationality}
                                    onChange={(e) =>
                                        setNationality(e.target.value)
                                    }
                                >

                                    <option value="India">
                                        India
                                    </option>

                                    <option value="United Kingdom">
                                        United Kingdom
                                    </option>

                                    <option value="United States">
                                        United States
                                    </option>

                                    <option value="Australia">
                                        Australia
                                    </option>

                                    <option value="Singapore">
                                        Singapore
                                    </option>

                                </select>

                            </div>


                            {/* Leaving On */}

                            <div className="agentsearch-modal-field">

                                <label htmlFor="agentsearch-leaving-on">
                                    Leaving On
                                    <span>*</span>
                                </label>

                                <input
                                    id="agentsearch-leaving-on"
                                    type="date"
                                    value={leavingOn}
                                    onChange={(e) =>
                                        setLeavingOn(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            {/* Travelers */}

                            <div className="agentsearch-modal-field">

                                <label htmlFor="agentsearch-travelers">
                                    Number of Travelers
                                    <span>*</span>
                                </label>

                                <select
                                    id="agentsearch-travelers"
                                    value={travelers}
                                    onChange={(e) =>
                                        setTravelers(e.target.value)
                                    }
                                >

                                    <option value="1 adult">
                                        1 adult
                                    </option>

                                    <option value="2 adults">
                                        2 adults
                                    </option>

                                    <option value="2 adults, 1 child">
                                        2 adults, 1 child
                                    </option>

                                    <option value="2 adults, 2 children">
                                        2 adults, 2 children
                                    </option>

                                    <option value="4 adults">
                                        4 adults
                                    </option>

                                </select>

                            </div>


                            {/* Star Rating */}

                            <div className="agentsearch-modal-field">

                                <label htmlFor="agentsearch-star-rating">
                                    Hotel Star Rating
                                </label>

                                <select
                                    id="agentsearch-star-rating"
                                    value={starRating}
                                    onChange={(e) =>
                                        setStarRating(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Any rating
                                    </option>

                                    <option value="3">
                                        3 Star
                                    </option>

                                    <option value="4">
                                        4 Star
                                    </option>

                                    <option value="5">
                                        5 Star
                                    </option>

                                </select>

                            </div>


                            {/* Transfers */}

                            <div className="agentsearch-transfer-option">

                                <label>

                                    <input
                                        type="checkbox"
                                        checked={addTransfers}
                                        onChange={(e) =>
                                            setAddTransfers(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <span>
                                        Add Transfers
                                    </span>

                                </label>

                                <p>
                                    Include airport and local transfers
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* Footer */}

                    <div className="agentsearch-modal-footer">

                        <button
                            type="button"
                            className="agentsearch-modal-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="agentsearch-create-button"
                        >
                            Create Proposal
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default CustomTripModal;