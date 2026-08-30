// Step 1 — imports

import { useState } from "react";
import "./AgentSearch.css";

import CustomTripModal from "./CustomTripModal";
import type { CustomTripData } from "./CustomTripModal";

import TripProposal from "./TripProposal";


// Step 2 — component

const AgentSearch = () => {

    // State

    const [customTripOpen, setCustomTripOpen] =
        useState(false);

    const [proposalData, setProposalData] =
        useState<CustomTripData | null>(null);


    // Handlers

    const handleOpenCustomTrip = () => {

        setCustomTripOpen(true);
    };


    const handleCloseCustomTrip = () => {

        setCustomTripOpen(false);
    };


    const handleCreateProposal = (
        data: CustomTripData
    ) => {

        setProposalData(data);
        setCustomTripOpen(false);
    };


    const handleBackToSearch = () => {

        setProposalData(null);
    };


    // Proposal page

    if (proposalData) {

        return (
            <TripProposal
                tripData={proposalData}
                onBack={handleBackToSearch}
            />
        );
    }


    // Return

    return (
        <>

            <section className="agentsearch-container">

                <div className="agentsearch-header">

                    <div>

                        <span className="agentsearch-eyebrow">
                            TRAVEL SERVICES
                        </span>

                        <h1 className="agentsearch-title">
                            Find your next experience
                        </h1>

                        <p className="agentsearch-subtitle">
                            Search destinations, packages and travel
                            experiences for your clients.
                        </p>

                    </div>

                </div>


                <form
                    className="agentsearch-form"
                    onSubmit={(e) => e.preventDefault()}
                >

                    <div className="agentsearch-fields">

                        {/* Leaving From */}

                        <div className="agentsearch-field">

                            <label
                                className="agentsearch-label"
                                htmlFor="agentsearch-from"
                            >
                                Leaving From
                            </label>

                            <div className="agentsearch-input-wrapper">

                                <span className="agentsearch-input-icon">
                                    ⌖
                                </span>

                                <input
                                    id="agentsearch-from"
                                    type="text"
                                    className="agentsearch-input"
                                    placeholder="e.g. Guwahati"
                                />

                            </div>

                        </div>


                        {/* Destination */}

                        <div className="agentsearch-field">

                            <label
                                className="agentsearch-label"
                                htmlFor="agentsearch-destination"
                            >
                                Destination
                            </label>

                            <div className="agentsearch-input-wrapper">

                                <span className="agentsearch-input-icon">
                                    ⌖
                                </span>

                                <input
                                    id="agentsearch-destination"
                                    type="text"
                                    className="agentsearch-input"
                                    placeholder="Where do you want to go?"
                                />

                            </div>

                        </div>


                        {/* Duration */}

                        <div className="agentsearch-field">

                            <label
                                className="agentsearch-label"
                                htmlFor="agentsearch-duration"
                            >
                                Duration
                            </label>

                            <div className="agentsearch-input-wrapper">

                                <span className="agentsearch-input-icon">
                                    ◷
                                </span>

                                <select
                                    id="agentsearch-duration"
                                    className="agentsearch-select"
                                    defaultValue=""
                                >

                                    <option value="" disabled>
                                        Select duration
                                    </option>

                                    <option value="1-3">
                                        1 – 3 Days
                                    </option>

                                    <option value="4-6">
                                        4 – 6 Days
                                    </option>

                                    <option value="7-10">
                                        7 – 10 Days
                                    </option>

                                    <option value="10+">
                                        10+ Days
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* Departure Month */}

                        <div className="agentsearch-field">

                            <label
                                className="agentsearch-label"
                                htmlFor="agentsearch-month"
                            >
                                Departure Month
                            </label>

                            <div className="agentsearch-input-wrapper">

                                <span className="agentsearch-input-icon">
                                    ◫
                                </span>

                                <select
                                    id="agentsearch-month"
                                    className="agentsearch-select"
                                    defaultValue=""
                                >

                                    <option value="" disabled>
                                        Select month
                                    </option>

                                    <option value="january">
                                        January
                                    </option>

                                    <option value="february">
                                        February
                                    </option>

                                    <option value="march">
                                        March
                                    </option>

                                    <option value="april">
                                        April
                                    </option>

                                    <option value="may">
                                        May
                                    </option>

                                    <option value="june">
                                        June
                                    </option>

                                    <option value="july">
                                        July
                                    </option>

                                    <option value="august">
                                        August
                                    </option>

                                    <option value="september">
                                        September
                                    </option>

                                    <option value="october">
                                        October
                                    </option>

                                    <option value="november">
                                        November
                                    </option>

                                    <option value="december">
                                        December
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <div className="agentsearch-footer">

                        <div className="agentsearch-hint">

                            <span className="agentsearch-hint-icon">
                                ✓
                            </span>

                            Flexible options available

                        </div>


                        <button
                            type="submit"
                            className="agentsearch-submit"
                        >
                            Search Packages
                        </button>

                    </div>

                </form>


                {/* Custom Trip */}

                <div className="agentsearch-custom-trip">

                    <div className="agentsearch-custom-content">

                        <span className="agentsearch-custom-label">
                            Can't find what you're looking for?
                        </span>

                        <span className="agentsearch-custom-text">
                            Create a custom itinerary tailored to your client.
                        </span>

                    </div>


                    <button
                        type="button"
                        className="agentsearch-custom-button"
                        onClick={handleOpenCustomTrip}
                    >
                        Create Custom Trip
                    </button>

                </div>

            </section>


            {/* Modal */}

            <CustomTripModal
                isOpen={customTripOpen}
                onClose={handleCloseCustomTrip}
                onCreateProposal={handleCreateProposal}
            />

        </>
    );
};


export default AgentSearch;