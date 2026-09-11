import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import Pagination from "../../../../Components/Pagination/Pagination";
import "./ViewActivityTransfers.css";

type Activity = {
    id: number;
    name: string;
    city?: {
        id: number;
        name: string;
    };
};

type TransferItem = {
    id: number;
    activity_id: number;
    name: string;
    transfer_type: "shared" | "private";
    transfer_duration: number | string;
    transfer_duration_unit: "minutes" | "hours";
    transfer_price: number | string;
    pickup_type: string | null;
    pickup_description: string | null;
    status: "active" | "inactive";
    activity?: Activity;
};

type TransfersPaginator = {
    data: TransferItem[];
    current_page: number;
    last_page: number;
};

type TransfersResponse = {
    status: boolean;
    data: TransfersPaginator;
};

const ViewActivityTransfers = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivityId, setSelectedActivityId] = useState("");
    const [transfers, setTransfers] = useState<TransferItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingTransfers, setLoadingTransfers] = useState(false);
    const [error, setError] = useState("");

    const formatPrice = (price: number | string) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(price));

    const fetchActivities = async () => {
        try {
            setLoadingActivities(true);
            const response = await api.get("/activity/list");
            const data = response?.data?.data?.data ?? [];
            setActivities(data);
        } catch (error) {
            console.error("Failed to load activities:", error);
        } finally {
            setLoadingActivities(false);
        }
    };

    const fetchTransfers = async (activityId: string, page: number = 1) => {
        if (!activityId) {
            setTransfers([]);
            setCurrentPage(1);
            setLastPage(1);
            return;
        }

        try {
            setLoadingTransfers(true);
            setError("");

            const response = await api.get<TransfersResponse>("/activity/transfers", {
                params: {
                    activity_id: Number(activityId),
                    page,
                },
            });

            const paginator = response.data.data;
            setTransfers(paginator.data);
            setCurrentPage(paginator.current_page);
            setLastPage(paginator.last_page);
        } catch (error: any) {
            setTransfers([]);
            setError(
                error?.response?.data?.message ||
                "Failed to load transfers."
            );
        } finally {
            setLoadingTransfers(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    useEffect(() => {
        if (selectedActivityId) {
            fetchTransfers(selectedActivityId, 1);
        } else {
            setTransfers([]);
            setCurrentPage(1);
            setLastPage(1);
        }
    }, [selectedActivityId]);

    return (
        <div className="vat">
            <div className="vat__header">
                <h2 className="vat__title">View Activity Transfers</h2>

                <div className="vat__filter">
                    <div className="vat__field">
                        <label className="vat__label">Activity</label>
                        <select
                            className="vat__select"
                            value={selectedActivityId}
                            onChange={(e) => setSelectedActivityId(e.target.value)}
                            disabled={loadingActivities}
                        >
                            <option value="">
                                {loadingActivities
                                    ? "Loading activities..."
                                    : "Select Activity"}
                            </option>

                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                    {activity.city?.name ? ` — ${activity.city.name}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loadingTransfers && <p className="vat__loading">Loading transfers...</p>}
            {error && <p className="vat__error">{error}</p>}

            {!selectedActivityId && !loadingTransfers && (
                <p className="vat__empty">Please select an activity to view transfers.</p>
            )}

            {!loadingTransfers && selectedActivityId && !error && transfers.length === 0 && (
                <p className="vat__empty">No transfers found for this activity.</p>
            )}

            {!loadingTransfers && selectedActivityId && transfers.length > 0 && (
                <>
                    <div className="vat__table-wrap">
                        <table className="vat__table">
                            <thead className="vat__thead">
                                <tr className="vat__row vat__row-head">
                                    <th className="vat__th">S.No</th>
                                    <th className="vat__th">Name</th>
                                    <th className="vat__th">Type</th>
                                    <th className="vat__th">Duration</th>
                                    <th className="vat__th">Price</th>
                                    <th className="vat__th">Pickup</th>
                                    <th className="vat__th">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transfers.map((item, index) => (
                                    <tr key={item.id} className="vat__row">
                                        <td className="vat__td">{index + 1}</td>

                                        <td className="vat__td">
                                            <strong className="vat__name">{item.name}</strong>
                                        </td>

                                        <td className="vat__td">{item.transfer_type}</td>

                                        <td className="vat__td">
                                            {item.transfer_duration} {item.transfer_duration_unit}
                                        </td>

                                        <td className="vat__td">{formatPrice(item.transfer_price)}</td>

                                        <td className="vat__td">
                                            {item.pickup_type || "N/A"}
                                            {item.pickup_description ? ` — ${item.pickup_description}` : ""}
                                        </td>

                                        <td className="vat__td">
                                            <span className={`vat__status ${item.status}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={(page) => fetchTransfers(selectedActivityId, page)}
                    />
                </>
            )}
        </div>
    );
};

export default ViewActivityTransfers;
