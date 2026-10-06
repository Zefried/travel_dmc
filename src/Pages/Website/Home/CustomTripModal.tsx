import { useState } from "react";
import "./CustomTripModal.css";
import { useItinerary } from "../../../Context/ItineraryContext";

type CustomTripModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateProposal: () => void;
};

const CustomTripModal = ({
    isOpen,
    onClose,
    onCreateProposal,
}: CustomTripModalProps) => {

    const { setTripConfig } = useItinerary();

    const [leavingFrom, setLeavingFrom] = useState("");
    const [nationality, setNationality] = useState("India");
    const [leavingOn, setLeavingOn] = useState("");
    const [nights, setNights] = useState(3);
    const [travelers, setTravelers] = useState("2 adults");
    const [addTransfers, setAddTransfers] = useState(true);

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        
        // Hardcode Guwahati as destination for now
        setTripConfig(
            { id: 101, name: "Guwahati" },
            leavingOn,
            nights,
            travelers
        );

        onCreateProposal();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="agentsearch-modal-overlay">
            <div
                className="agentsearch-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="agentsearch-modal-title"
            >
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
                            Build a personalized itinerary to Guwahati.
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
                    <section className="agentsearch-modal-section">
                        <div className="agentsearch-section-heading">
                            <div>
                                <span className="agentsearch-section-number">
                                    01
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
                                    placeholder="e.g. Mumbai"
                                />
                            </div>

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
                                    <option value="India">India</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Singapore">Singapore</option>
                                </select>
                            </div>

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

                            <div className="agentsearch-modal-field">
                                <label htmlFor="agentsearch-nights">
                                    Nights
                                    <span>*</span>
                                </label>
                                <select
                                    id="agentsearch-nights"
                                    value={nights}
                                    onChange={(e) =>
                                        setNights(Number(e.target.value))
                                    }
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'night' : 'nights'}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="agentsearch-modal-field">
                                <label htmlFor="agentsearch-travelers">
                                    Travelers
                                    <span>*</span>
                                </label>
                                <select
                                    id="agentsearch-travelers"
                                    value={travelers}
                                    onChange={(e) =>
                                        setTravelers(e.target.value)
                                    }
                                >
                                    <option value="1 adult">1 adult</option>
                                    <option value="2 adults">2 adults</option>
                                    <option value="2 adults, 1 child">2 adults, 1 child</option>
                                    <option value="2 adults, 2 children">2 adults, 2 children</option>
                                </select>
                            </div>

                            <div className="agentsearch-modal-field">
                                <label className="agentsearch-transfer-option">
                                    <input
                                        type="checkbox"
                                        checked={addTransfers}
                                        onChange={(e) =>
                                            setAddTransfers(e.target.checked)
                                        }
                                    />
                                    <span>Include Airport Transfers</span>
                                </label>
                            </div>
                        </div>
                    </section>

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
                            disabled={!leavingOn}
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