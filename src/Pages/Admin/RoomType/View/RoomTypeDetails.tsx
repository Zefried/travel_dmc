// Step 1 — imports

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios";


// Step 2 — types

type RoomType = {
    id: number;
    property_id: number;
    name: string;
    type: string;
    bedroom: number;
    size: string;
    size_unit: string;
    max_adults: number;
    max_children: number;
    max_occupancy: number;
    view: string;
    default_bed_type: string;
    default_bed_quantity: number;
    description: string | null;
    status: string;
    base_price: number;
    created_at: string;
    updated_at: string;
};


// Step 3 — component

const RoomTypeDetails = () => {

    // Step 4 — state

    const { id } = useParams<{ id: string }>();

    const [roomType, setRoomType] = useState<RoomType | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Step 5 — functions

    const fetchRoomType = async () => {

        if (!id) {
            setError("Room type ID is missing.");
            return;
        }

        const response = await api.get(
            `/hotel/room-types/${id}`
        );

        setRoomType(response.data.data);
    };


    // Step 6 — effects

    useEffect(() => {

        const loadRoomType = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchRoomType();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load room type details."
                );

            } finally {

                setLoading(false);
            }
        };

        loadRoomType();

    }, [id]);


    // Step 7 — return()

    return (
        <div>

            <h1>
                Room Type Details
            </h1>


            {loading && (
                <p>
                    Loading room type...
                </p>
            )}


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading && !error && roomType && (

                <div>

                    <h2>
                        {roomType.name}
                    </h2>

                    <p>
                        Property ID: {roomType.property_id}
                    </p>

                    <p>
                        Type: {roomType.type}
                    </p>

                    <p>
                        Bedrooms: {roomType.bedroom}
                    </p>

                    <p>
                        Size: {roomType.size} {roomType.size_unit}
                    </p>

                    <p>
                        Max Adults: {roomType.max_adults}
                    </p>

                    <p>
                        Max Children: {roomType.max_children}
                    </p>

                    <p>
                        Max Occupancy: {roomType.max_occupancy}
                    </p>

                    <p>
                        View: {roomType.view}
                    </p>

                    <p>
                        Default Bed Type: {roomType.default_bed_type}
                    </p>

                    <p>
                        Default Bed Quantity: {
                            roomType.default_bed_quantity
                        }
                    </p>

                    <p>
                        Description: {
                            roomType.description || "—"
                        }
                    </p>

                    <p>
                        Status: {roomType.status}
                    </p>

                    <p>
                        Base Price: {roomType.base_price}
                    </p>

                    <p>
                        Created At: {roomType.created_at}
                    </p>

                    <p>
                        Updated At: {roomType.updated_at}
                    </p>

                </div>
            )}

        </div>
    );
};


export default RoomTypeDetails;