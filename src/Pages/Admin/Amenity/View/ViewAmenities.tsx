// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import '../Styles/ViewAmenities.css';


type Amenity = {
    id: number;
    category: string;
    name: string;
    description: string | null;
    status: string;
};


const ViewAmenities = () => {

    // Step 2 — state

    const [amenities, setAmenities] = useState<Amenity[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 3 — functions

    const fetchAmenities = async () => {

        const response = await api.get("/hotel/amenities");

        setAmenities(response.data.data);
    };


    useEffect(() => {

        const loadAmenities = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchAmenities();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load amenities."
                );

            } finally {

                setLoading(false);
            }
        };

        loadAmenities();

    }, []);


    // Step 4 — handlers


    // Step 5 — return()

    return (
        <div className="va-container">

            <div className="va-header">

                <h1 className="va-title">
                    Amenities
                </h1>

            </div>


            {loading && (
                <div className="va-loading">
                    Loading amenities...
                </div>
            )}


            {error && (
                <div className="va-error">
                    {error}
                </div>
            )}


            {!loading && !error && amenities.length === 0 && (
                <div className="va-empty">
                    No amenities found.
                </div>
            )}


            <div className="va-list">

                {amenities.map((amenity) => (

                    <div
                        key={amenity.id}
                        className="va-item"
                    >

                        <h3 className="va-name">
                            {amenity.name}
                        </h3>

                        <p className="va-category">
                            {amenity.category}
                        </p>

                        {amenity.description && (
                            <p className="va-description">
                                {amenity.description}
                            </p>
                        )}

                        <p className="va-status">
                            {amenity.status}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
};


export default ViewAmenities;