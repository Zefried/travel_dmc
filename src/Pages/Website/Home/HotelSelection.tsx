import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { useItinerary } from "../../../Context/ItineraryContext";

type Property = {
    id: number;
    name: string;
    city_id: number;
    star_rating?: number;
};

type City = {
    id: number;
    name: string;
};

const HotelSelection = () => {
    const { state, setHotel } = useItinerary();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);

                // 1. Fetch cities to get Guwahati ID
                const cityRes = await api.get('/admin/cities/options');
                if (!cityRes.data?.status) throw new Error("Failed to load cities");

                const guwahati = cityRes.data.data.find((c: City) => c.name.toLowerCase() === 'guwahati');
                if (!guwahati) throw new Error("Guwahati city not found in database");

                // 2. Fetch properties and filter
                const propRes = await api.get('/admin/properties/options');
                if (!propRes.data?.status) throw new Error("Failed to load properties");

                const guwahatiProperties = propRes.data.data.filter((p: Property) => p.city_id === guwahati.id);
                setProperties(guwahatiProperties);

            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSelectHotel = (property: Property) => {
        setHotel({
            id: property.id,
            name: property.name,
            image: "", // Placeholder or default image
            starRating: property.star_rating || 5
        });
    };

    if (loading) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading available hotels in Guwahati...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                <p>{error}</p>
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="agentsearch-hotel-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No hotels currently available in Guwahati.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {properties.map(property => (
                <div key={property.id} className="agentsearch-hotel-card">
                    <div className="agentsearch-hotel-image">
                        <div className="agentsearch-hotel-placeholder">HOTEL</div>
                    </div>

                    <div className="agentsearch-hotel-content">
                        <div className="agentsearch-hotel-rating">
                            {"★".repeat(property.star_rating || 5)}
                        </div>

                        <h3>{property.name}</h3>

                        <p className="agentsearch-hotel-address">
                            Guwahati, Assam
                        </p>

                        <div className="agentsearch-hotel-features">
                            <p>✓ Premium selection</p>
                            <p>✓ Great location</p>
                        </div>

                        <button
                            type="button"
                            className="agentsearch-save-button"
                            style={{ width: 'auto', marginTop: '1rem' }}
                            onClick={() => handleSelectHotel(property)}
                        >
                            Select Hotel
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotelSelection;
