import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import "./AddActivityTransfer.css";

type Activity = {
    id: number;
    name: string;
    category: string | null;
    city: {
        id: number;
        name: string;
    };
};

const AddActivityTransfer = () => {

    // Step 1 — state

    const [activities, setActivities] = useState<Activity[]>([]);

    const [activityId, setActivityId] = useState("");

    const [name, setName] = useState("");
    const [transferType, setTransferType] = useState("shared");

    const [transferDuration, setTransferDuration] = useState("");
    const [transferDurationUnit, setTransferDurationUnit] =
        useState("minutes");

    const [transferPrice, setTransferPrice] = useState("");

    const [pickupType, setPickupType] = useState("");
    const [pickupDescription, setPickupDescription] = useState("");

    const [status, setStatus] = useState("active");

    const [loadingActivities, setLoadingActivities] =
        useState(false);

    const [saving, setSaving] = useState(false);


    // Step 2 — functions

    const fetchActivities = async () => {
        try {

            setLoadingActivities(true);

            const response = await api.get(
                "/activity/list"
            );

            setActivities(response.data.data.data);

        } catch (error) {

            console.error(
                "Failed to fetch activities:",
                error
            );

        } finally {

            setLoadingActivities(false);
        }
    };


    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {

            setSaving(true);

            const payload = {
                activity_id: Number(activityId),

                name,
                transfer_type: transferType,

                transfer_duration: Number(
                    transferDuration
                ),

                transfer_duration_unit:
                    transferDurationUnit,

                transfer_price: Number(
                    transferPrice
                ),

                pickup_type: pickupType || null,

                pickup_description:
                    pickupDescription || null,

                status,
            };


            const response = await api.post(
                "/activity/transfers",
                payload
            );


            console.log(
                "Activity transfer created:",
                response.data
            );


            alert(
                "Activity transfer created successfully."
            );


            setActivityId("");

            setName("");
            setTransferType("shared");

            setTransferDuration("");
            setTransferDurationUnit("minutes");

            setTransferPrice("");

            setPickupType("");
            setPickupDescription("");

            setStatus("active");


        } catch (error) {

            console.error(
                "Failed to create activity transfer:",
                error
            );

        } finally {

            setSaving(false);
        }
    };


    // Step 3 — handlers

    const handleActivityChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setActivityId(
            event.target.value
        );
    };


    // Step 4 — effects

    useEffect(() => {
        fetchActivities();
    }, []);


    // Step 5 — return()

    return (
        <div className="add-activity-transfer">

            <div className="add-activity-transfer__header">
                <h2 className="add-activity-transfer__title">
                    Add Activity Transfer
                </h2>
            </div>


            <form
                className="add-activity-transfer__form"
                onSubmit={handleSubmit}
            >

                {/* Activity */}

                <div className="add-activity-transfer__section">

                    <h3 className="add-activity-transfer__section-title">
                        Activity
                    </h3>


                    <div className="add-activity-transfer__field">

                        <label>
                            Activity
                        </label>

                        <select
                            value={activityId}
                            onChange={handleActivityChange}
                            disabled={loadingActivities}
                            required
                        >
                            <option value="">
                                {loadingActivities
                                    ? "Loading activities..."
                                    : "Select Activity"}
                            </option>

                            {activities.map((activity) => (
                                <option
                                    key={activity.id}
                                    value={activity.id}
                                >
                                    {activity.name} —{" "}
                                    {activity.city?.name}
                                </option>
                            ))}

                        </select>

                    </div>

                </div>


                {/* Transfer Information */}

                <div className="add-activity-transfer__section">

                    <h3 className="add-activity-transfer__section-title">
                        Transfer Information
                    </h3>


                    <div className="add-activity-transfer__grid">

                        {/* Name */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Transfer Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="e.g. Private Transfer"
                                required
                            />

                        </div>


                        {/* Transfer Type */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Transfer Type
                            </label>

                            <select
                                value={transferType}
                                onChange={(event) =>
                                    setTransferType(
                                        event.target.value
                                    )
                                }
                                required
                            >
                                <option value="shared">
                                    Shared
                                </option>

                                <option value="private">
                                    Private
                                </option>
                            </select>

                        </div>


                        {/* Transfer Duration */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Transfer Duration
                            </label>

                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={transferDuration}
                                onChange={(event) =>
                                    setTransferDuration(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. 60"
                                required
                            />

                        </div>


                        {/* Duration Unit */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Duration Unit
                            </label>

                            <select
                                value={transferDurationUnit}
                                onChange={(event) =>
                                    setTransferDurationUnit(
                                        event.target.value
                                    )
                                }
                                required
                            >
                                <option value="minutes">
                                    Minutes
                                </option>

                                <option value="hours">
                                    Hours
                                </option>

                            </select>

                        </div>


                        {/* Transfer Price */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Transfer Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={transferPrice}
                                onChange={(event) =>
                                    setTransferPrice(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter transfer price"
                                required
                            />

                        </div>


                        {/* Pickup Type */}

                        <div className="add-activity-transfer__field">

                            <label>
                                Pickup Type
                            </label>

                            <select
                                value={pickupType}
                                onChange={(event) =>
                                    setPickupType(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select Pickup Type
                                </option>

                                <option value="hotel">
                                    Hotel
                                </option>

                                <option value="airport">
                                    Airport
                                </option>

                                <option value="station">
                                    Station
                                </option>

                                <option value="meeting_point">
                                    Meeting Point
                                </option>
                            </select>

                        </div>

                    </div>


                    {/* Pickup Description */}

                    <div className="add-activity-transfer__field">

                        <label>
                            Pickup Description
                        </label>

                        <textarea
                            value={pickupDescription}
                            onChange={(event) =>
                                setPickupDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe pickup and drop-off details"
                            rows={4}
                        />

                    </div>


                    {/* Status */}

                    <div className="add-activity-transfer__field">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                    </div>

                </div>


                {/* Submit */}

                <div className="add-activity-transfer__actions">

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Creating..."
                            : "Create Transfer"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddActivityTransfer;