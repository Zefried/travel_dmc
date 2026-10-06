import { useState, useEffect } from "react";
import "./CustomTripModal.css";
import { useItinerary, type TimeSlot, type ActivityItem } from "../../../Context/ItineraryContext";
import api from "../../../api/axios";

type ActivityData = {
    id: number;
    name: string;
    duration: number; // assuming the API returns hours, or we can parse duration_unit
    duration_unit: string;
    base_price: number;
};

type ActivitySelectionProps = {
    isOpen: boolean;
    dayIndex: number | null;
    onClose: () => void;
};

const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const mins = (time - hours) * 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${mins === 0 ? '00' : mins} ${ampm}`;
};

const ActivitySelection = ({ isOpen, dayIndex, onClose }: ActivitySelectionProps) => {
    const { state, addActivity } = useItinerary();

    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState<number | "">("");
    const [selectedStartTime, setSelectedStartTime] = useState<number | "">("");

    useEffect(() => {
        if (isOpen && state.city) {
            const fetchActivities = async () => {
                setLoading(true);
                try {
                    // Fetch activities for the selected city
                    const res = await api.get(`/public/activities?city_id=${state.city?.id}`);
                    if (res.data?.status) {
                        // Laravel pagination returns items inside data.data
                        const apiActivities = res.data.data.data || [];
                        setActivities(apiActivities);
                    }
                } catch (error) {
                    console.error("Failed to load activities", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchActivities();
        }
    }, [isOpen, state.city]);

    if (!isOpen || dayIndex === null || !state.days[dayIndex]) return null;

    const day = state.days[dayIndex];
    const availableSlots = day.availableSlots;

    const selectedActivity = activities.find(a => a.id === selectedActivityId);

    // Calculate duration in hours strictly
    const getDurationInHours = (act: ActivityData) => {
        let dur = Number(act.duration) || 1;
        if (act.duration_unit === 'minutes') return dur / 60;
        if (act.duration_unit === 'days') return dur * 24;
        return dur;
    };

    // Calculate possible start times for the selected activity
    const getPossibleStartTimes = (duration: number): number[] => {
        const times: number[] = [];

        availableSlots.forEach(slot => {
            // We can start every half hour
            for (let t = slot.start; t <= slot.end - duration; t += 0.5) {
                times.push(t);
            }
        });

        return times;
    };

    const possibleStartTimes = selectedActivity ? getPossibleStartTimes(getDurationInHours(selectedActivity)) : [];

    const handleSave = () => {
        if (selectedActivity && selectedStartTime !== "") {
            const newActivity: ActivityItem = {
                id: Date.now(),
                name: selectedActivity.name,
                duration: getDurationInHours(selectedActivity),
                price: Number(selectedActivity.base_price) || 0,
                startTime: selectedStartTime as number
            };

            addActivity(dayIndex, newActivity);
            onClose();
            // Reset state
            setSelectedActivityId("");
            setSelectedStartTime("");
        }
    };

    const handleClose = () => {
        setSelectedActivityId("");
        setSelectedStartTime("");
        onClose();
    };

    return (
        <div className="agentsearch-modal-overlay">
            <div className="agentsearch-modal" role="dialog">
                <div className="agentsearch-modal-header">
                    <div>
                        <span className="agentsearch-modal-eyebrow">SCHEDULE</span>
                        <h2 className="agentsearch-modal-title">Add Activity to Day {day.dayNumber}</h2>
                        <p className="agentsearch-modal-subtitle">Select an activity and a valid start time.</p>
                    </div>
                    <button type="button" className="agentsearch-modal-close" onClick={handleClose}>×</button>
                </div>

                <div className="agentsearch-modal-section" style={{ padding: '24px 26px' }}>
                    <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569', fontWeight: 600 }}>Available Time Blocks:</h4>
                        {availableSlots.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '13px', lineHeight: 1.6 }}>
                                {availableSlots.map((slot, i) => (
                                    <li key={i}><strong>{formatTime(slot.start)}</strong> - <strong>{formatTime(slot.end)}</strong></li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ margin: 0, color: '#ef4444' }}>No free time left today.</p>
                        )}
                    </div>

                    <div className="agentsearch-modal-field" style={{ marginBottom: '20px' }}>
                        <label>Select Activity</label>
                        <select
                            value={selectedActivityId}
                            onChange={(e) => {
                                setSelectedActivityId(Number(e.target.value));
                                setSelectedStartTime("");
                            }}
                            disabled={loading}
                        >
                            <option value="">{loading ? "Loading activities..." : "Select an Activity..."}</option>
                            {activities.map(act => {
                                const durHours = getDurationInHours(act);
                                const canFit = availableSlots.some(slot => (slot.end - slot.start) >= durHours);
                                return (
                                    <option key={act.id} value={act.id} disabled={!canFit}>
                                        {act.name} ({durHours} hrs) - ₹{act.base_price} {!canFit && '(Not enough time)'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {selectedActivity && (
                        <div className="agentsearch-modal-field" style={{ marginBottom: '1.5rem' }}>
                            <label>Start Time</label>
                            <select
                                value={selectedStartTime}
                                onChange={(e) => setSelectedStartTime(Number(e.target.value))}
                                disabled={possibleStartTimes.length === 0}
                            >
                                <option value="">Select Time...</option>
                                {possibleStartTimes.map(time => (
                                    <option key={time} value={time}>
                                        {formatTime(time)} (Ends at {formatTime(time + getDurationInHours(selectedActivity))})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="agentsearch-modal-footer">
                    <button type="button" className="agentsearch-modal-cancel" onClick={handleClose}>Cancel</button>
                    <button
                        type="button"
                        className="agentsearch-create-button"
                        disabled={!selectedActivity || selectedStartTime === ""}
                        onClick={handleSave}
                    >
                        Schedule Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivitySelection;
