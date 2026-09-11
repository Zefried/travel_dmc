import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

type Property = {
    id: number;
    name: string;
    type: string;
    phone: string;
    email: string | null;
    status: string;
    city?: {
        id: number;
        name: string;
    };
    country?: {
        id: number;
        name: string;
    };
};

type Image = {
    id: number;
    image_url: string;
    image_name: string;
    sort_order: number;
    is_primary: boolean;
};

type ImagesResponse = {
    status: boolean;
    data: Image[];
};

const PROPERTY_IMAGE_TYPE = "App\\Models\\Property";

const ViewPropertyImages = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [searching, setSearching] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const query = searchQuery.trim();

        if (query.length < 3) {
            setProperties([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearching(true);
            setError("");

            try {
                const response = await api.get(
                    "/hotel/properties/for-room-configuration",
                    {
                        params: { query },
                    }
                );

                setProperties(response.data.data);
            } catch (error: any) {
                setProperties([]);
                setError(
                    error?.response?.data?.message ||
                        "Failed to search properties."
                );
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (!selectedProperty) {
            setImages([]);
            return;
        }

        const loadImages = async () => {
            setLoadingImages(true);
            setError("");

            try {
                const response = await api.get<ImagesResponse>(
                    "/images",
                    {
                        params: {
                            imageable_id: selectedProperty.id,
                            imageable_type: PROPERTY_IMAGE_TYPE,
                        },
                    }
                );

                setImages(response.data.data);
            } catch (error: any) {
                setImages([]);
                setError(
                    error?.response?.data?.message ||
                        "Failed to load property images."
                );
            } finally {
                setLoadingImages(false);
            }
        };

        loadImages();
    }, [selectedProperty]);

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value);
        setSelectedProperty(null);
        setImages([]);
        setError("");
    };

    const handleSelect = (property: Property) => {
        setSelectedProperty(property);
        setSearchQuery("");
        setProperties([]);
        setError("");
    };

    const handleRemove = () => {
        setSearchQuery("");
        setProperties([]);
        setSelectedProperty(null);
        setImages([]);
        setError("");
    };

    const getImageUrl = (path: string) => {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
        const storagePath = path.replace(/^\/?(storage\/)?/, "");

        return `${apiUrl}/storage/${storagePath}`;
    };

    return (
        <div>
            <h2>View Property Images</h2>

            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter property name, phone or email"
            />

            {searching && <p>Searching properties...</p>}

            {!searching &&
                properties.length === 0 &&
                searchQuery.trim().length >= 3 &&
                !error && <p>No properties found.</p>}

            {properties.map((property) => (
                <div key={property.id}>
                    <h3>{property.name}</h3>
                    <p>
                        {property.city?.name ?? "N/A"},{" "}
                        {property.country?.name ?? "N/A"}
                    </p>
                    <p>{property.phone}</p>
                    <button
                        type="button"
                        onClick={() => handleSelect(property)}
                    >
                        View Images
                    </button>
                </div>
            ))}

            {error && <p>{error}</p>}

            {selectedProperty && (
                <section>
                    <h3>{selectedProperty.name}</h3>
                    <p>
                        Showing images for Property ID: {selectedProperty.id}
                    </p>
                    <button type="button" onClick={handleRemove}>
                        Choose another property
                    </button>

                    {loadingImages && <p>Loading images...</p>}

                    {!loadingImages && images.length === 0 && !error && (
                        <p>No images have been uploaded for this property.</p>
                    )}

                    {!loadingImages && images.length > 0 && (
                        <div>
                            {images.map((image) => (
                                <figure key={image.id}>
                                    <img
                                        src={getImageUrl(image.image_url)}
                                        alt={image.image_name}
                                        width={250}
                                        height={180}
                                    />
                                    <figcaption>
                                        {image.image_name}
                                        {image.is_primary && " (Primary)"}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default ViewPropertyImages;
