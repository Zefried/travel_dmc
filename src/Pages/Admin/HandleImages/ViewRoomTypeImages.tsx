import { useEffect, useState } from "react";
import api from "../../../api/axios";
import SelectProperty from "../RoomType/Add/SelectProperty";

type Property = {
    id: number;
    name: string;
    country: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    hotel_admin: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
};

type RoomType = {
    id: number;
    name: string;
    type: string;
    bedroom: number;
    max_occupancy: number;
    status: string;
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

const ROOM_TYPE_IMAGE_TYPE = "App\\Models\\RoomType";

const ViewRoomTypeImages = () => {
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [selectedRoomType, setSelectedRoomType] =
        useState<RoomType | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedProperty) {
            setRoomTypes([]);
            setSelectedRoomType(null);
            setImages([]);
            return;
        }

        const fetchRoomTypes = async () => {
            setLoadingRoomTypes(true);
            setError("");
            setSelectedRoomType(null);
            setImages([]);

            try {
                const response = await api.get(
                    "/hotel/room-types/list",
                    {
                        params: { property_id: selectedProperty.id },
                    }
                );

                setRoomTypes(response.data.data.data);
            } catch (error: any) {
                setRoomTypes([]);
                setError(
                    error?.response?.data?.message ||
                        "Failed to load room types."
                );
            } finally {
                setLoadingRoomTypes(false);
            }
        };

        fetchRoomTypes();
    }, [selectedProperty]);

    useEffect(() => {
        if (!selectedRoomType) {
            setImages([]);
            return;
        }

        const fetchImages = async () => {
            setLoadingImages(true);
            setError("");

            try {
                const response = await api.get<ImagesResponse>(
                    "/images",
                    {
                        params: {
                            imageable_id: selectedRoomType.id,
                            imageable_type: ROOM_TYPE_IMAGE_TYPE,
                        },
                    }
                );

                setImages(response.data.data);
            } catch (error: any) {
                setImages([]);
                setError(
                    error?.response?.data?.message ||
                        "Failed to load room type images."
                );
            } finally {
                setLoadingImages(false);
            }
        };

        fetchImages();
    }, [selectedRoomType]);

    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
        setError("");
    };

    const handlePropertyRemove = () => {
        setSelectedProperty(null);
        setRoomTypes([]);
        setSelectedRoomType(null);
        setImages([]);
        setError("");
    };

    const handleRoomTypeSelect = (roomType: RoomType) => {
        setSelectedRoomType(roomType);
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
            <h2>View Room Type Images</h2>

            <SelectProperty
                selectedProperty={selectedProperty}
                onSelect={handlePropertySelect}
                onRemove={handlePropertyRemove}
            />

            {error && <p>{error}</p>}

            {selectedProperty && (
                <section>
                    <h2>Room Types</h2>

                    {loadingRoomTypes && <p>Loading room types...</p>}

                    {!loadingRoomTypes && roomTypes.length === 0 && !error && (
                        <p>No room types found for this property.</p>
                    )}

                    {!loadingRoomTypes && roomTypes.length > 0 && (
                        <div>
                            {roomTypes.map((roomType) => (
                                <div key={roomType.id}>
                                    <h3>{roomType.name}</h3>
                                    <p>Type: {roomType.type}</p>
                                    <p>Bedrooms: {roomType.bedroom}</p>
                                    <p>
                                        Max Occupancy: {roomType.max_occupancy}
                                    </p>
                                    <p>Status: {roomType.status}</p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoomTypeSelect(roomType)
                                        }
                                    >
                                        View Images
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {selectedRoomType && (
                <section>
                    <h2>{selectedRoomType.name} Images</h2>
                    <p>Room Type ID: {selectedRoomType.id}</p>

                    {loadingImages && <p>Loading images...</p>}

                    {!loadingImages && images.length === 0 && !error && (
                        <p>No images have been uploaded for this room type.</p>
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

export default ViewRoomTypeImages;
