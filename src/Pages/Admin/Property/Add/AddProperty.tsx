import { useState } from "react";
import axios from "axios";

const AddProperty = () => {
    const [adprName, setAdprName] = useState("");
    const [adprType, setAdprType] = useState("");
    const [adprStarRating, setAdprStarRating] = useState("");
    const [adprDescription, setAdprDescription] = useState("");

    const [adprCountryId, setAdprCountryId] = useState("");
    const [adprStateId, setAdprStateId] = useState("");
    const [adprCityId, setAdprCityId] = useState("");

    const [adprAddress, setAdprAddress] = useState("");
    const [adprPostalCode, setAdprPostalCode] = useState("");

    const [adprLatitude, setAdprLatitude] = useState("");
    const [adprLongitude, setAdprLongitude] = useState("");

    const [adprPhone, setAdprPhone] = useState("");
    const [adprAlternativePhone, setAdprAlternativePhone] = useState("");
    const [adprEmail, setAdprEmail] = useState("");
    const [adprWebsite, setAdprWebsite] = useState("");

    const [adprStatus, setAdprStatus] = useState("active");

    const [adprLoading, setAdprLoading] = useState(false);
    const [adprError, setAdprError] = useState("");
    const [adprSuccess, setAdprSuccess] = useState("");

    const adprHandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setAdprLoading(true);
        setAdprError("");
        setAdprSuccess("");

        try {
            const adprData = {
                name: adprName,
                type: adprType,
                star_rating: adprStarRating
                    ? Number(adprStarRating)
                    : null,
                description: adprDescription,

                country_id: Number(adprCountryId),
                state_id: adprStateId
                    ? Number(adprStateId)
                    : null,
                city_id: Number(adprCityId),

                address: adprAddress,
                postal_code: adprPostalCode,

                latitude: adprLatitude
                    ? Number(adprLatitude)
                    : null,
                longitude: adprLongitude
                    ? Number(adprLongitude)
                    : null,

                phone: adprPhone,
                alternative_phone: adprAlternativePhone || null,
                email: adprEmail || null,
                website: adprWebsite || null,

                status: adprStatus,
            };

            const adprResponse = await axios.post(
                "/api/properties",
                adprData
            );

            setAdprSuccess(
                adprResponse.data.message ||
                "Property created successfully."
            );
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setAdprError(
                    Object.values(error.response.data.errors)
                        .flat()
                        .join(" ")
                );
            } else {
                setAdprError(
                    error.response?.data?.message ||
                    "Failed to create property."
                );
            }
        } finally {
            setAdprLoading(false);
        }
    };
    return (
        <div className="adpr-container">
            <h2>Add Property</h2>

            {adprError && (
                <div className="adpr-error">
                    {adprError}
                </div>
            )}

            {adprSuccess && (
                <div className="adpr-success">
                    {adprSuccess}
                </div>
            )}

            <form onSubmit={adprHandleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={adprName}
                        onChange={(e) => setAdprName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Type</label>
                    <input
                        type="text"
                        value={adprType}
                        onChange={(e) => setAdprType(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Star Rating</label>
                    <select
                        value={adprStarRating}
                        onChange={(e) =>
                            setAdprStarRating(e.target.value)
                        }
                    >
                        <option value="">Select rating</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        value={adprDescription}
                        onChange={(e) =>
                            setAdprDescription(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Country ID</label>
                    <input
                        type="number"
                        value={adprCountryId}
                        onChange={(e) =>
                            setAdprCountryId(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>State ID</label>
                    <input
                        type="number"
                        value={adprStateId}
                        onChange={(e) =>
                            setAdprStateId(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>City ID</label>
                    <input
                        type="number"
                        value={adprCityId}
                        onChange={(e) =>
                            setAdprCityId(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Address</label>
                    <textarea
                        value={adprAddress}
                        onChange={(e) =>
                            setAdprAddress(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Postal Code</label>
                    <input
                        type="text"
                        value={adprPostalCode}
                        onChange={(e) =>
                            setAdprPostalCode(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Latitude</label>
                    <input
                        type="number"
                        step="any"
                        value={adprLatitude}
                        onChange={(e) =>
                            setAdprLatitude(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Longitude</label>
                    <input
                        type="number"
                        step="any"
                        value={adprLongitude}
                        onChange={(e) =>
                            setAdprLongitude(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        value={adprPhone}
                        onChange={(e) =>
                            setAdprPhone(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Alternative Phone</label>
                    <input
                        type="text"
                        value={adprAlternativePhone}
                        onChange={(e) =>
                            setAdprAlternativePhone(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={adprEmail}
                        onChange={(e) =>
                            setAdprEmail(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Website</label>
                    <input
                        type="text"
                        value={adprWebsite}
                        onChange={(e) =>
                            setAdprWebsite(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Status</label>
                    <select
                        value={adprStatus}
                        onChange={(e) =>
                            setAdprStatus(e.target.value)
                        }
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={adprLoading}
                >
                    {adprLoading ? "Creating..." : "Create Property"}
                </button>
            </form>
        </div>
    );
};

export default AddProperty;
