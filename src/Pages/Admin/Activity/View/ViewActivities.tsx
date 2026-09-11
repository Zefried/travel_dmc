import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import Pagination from "../../../../Components/Pagination/Pagination";
import "./ViewActivities.css";

type Location = {
    id: number;
    name: string;
};

type Activity = {
    id: number;
    name: string;
    category: string | null;
    description: string | null;
    duration: string | number;
    duration_unit: "minutes" | "hours" | "days";
    base_price: string | number;
    status: "active" | "inactive";
    country: Location;
    state: Location;
    city: Location;
};

type ActivityPaginator = {
    data: Activity[];
    current_page: number;
    last_page: number;
};

type ActivitiesResponse = {
    status: boolean;
    data: ActivityPaginator;
};

const ViewActivities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get<ActivitiesResponse>(
                    "/activity/list",
                    {
                        params: { page: currentPage },
                    }
                );

                const paginator = response.data.data;

                setActivities(paginator.data);
                setCurrentPage(paginator.current_page);
                setLastPage(paginator.last_page);
            } catch (error: any) {
                setActivities([]);
                setError(
                    error?.response?.data?.message ||
                        "Failed to load activities."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [currentPage]);

    const formatPrice = (price: string | number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(price));

    return (
        <div className="vwactivity">
            <h2 className="vwactivity__title">View Activities</h2>

            {loading && <p className="vwactivity__loading">Loading activities...</p>}

            {error && <p className="vwactivity__error">{error}</p>}

            {!loading && !error && activities.length === 0 && (
                <p className="vwactivity__empty">No activities found.</p>
            )}

            {!loading && !error && activities.length > 0 && (
                <>
                    <div className="vwactivity__table-wrap">
                        <table className="vwactivity__table">
                            <thead className="vwactivity__thead">
                                <tr className="vwactivity__row vwactivity__row-head">
                                    <th className="vwactivity__th">S.No</th>
                                    <th className="vwactivity__th">Activity</th>
                                    <th className="vwactivity__th">Location</th>
                                    <th className="vwactivity__th">Duration</th>
                                    <th className="vwactivity__th">Base Price</th>
                                    <th className="vwactivity__th">Status</th>
                                    <th className="vwactivity__th">Description</th>
                                </tr>
                            </thead>

                            <tbody className="vwactivity__tbody">
                                {activities.map((activity, index) => (
                                    <tr key={activity.id} className="vwactivity__row">
                                        <td className="vwactivity__td" data-label="S.No">
                                            {index + 1}
                                        </td>

                                        <td className="vwactivity__td" data-label="Activity">
                                            <strong className="vwactivity__name">{activity.name}</strong>
                                            <div className="vwactivity__category">
                                                {activity.category ?? "No category"}
                                            </div>
                                        </td>

                                        <td className="vwactivity__td" data-label="Location">
                                            {activity.country?.name ?? "N/A"}
                                            {" → "}
                                            {activity.state?.name ?? "N/A"}
                                            {" → "}
                                            {activity.city?.name ?? "N/A"}
                                        </td>

                                        <td className="vwactivity__td" data-label="Duration">
                                            {activity.duration} {activity.duration_unit}
                                        </td>

                                        <td className="vwactivity__td" data-label="Base Price">
                                            {formatPrice(activity.base_price)}
                                        </td>

                                        <td className="vwactivity__td" data-label="Status">
                                            <span className={`vwactivity__status ${activity.status}`}>
                                                {activity.status}
                                            </span>
                                        </td>

                                        <td className="vwactivity__td" data-label="Description">
                                            {activity.description ?? "No description"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default ViewActivities;
