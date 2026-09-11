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
    description: string | null;
    default_bed_type: string;
    default_bed_quantity: number;
    base_price: string;
    status: string;
};

type ImageError = {
    index: number | null;
    name: string | null;
    errors: string[];
};

type UploadResponse = {
    status: boolean;
    message: string;
    uploaded: any[];
    duplicates: string[];
    image_errors?: ImageError[];
};

const AddRomeTypeImages = () => {
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [selectedRoomType, setSelectedRoomType] =
        useState<RoomType | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [imageErrors, setImageErrors] = useState<ImageError[]>([]);

    const fetchRoomTypes = async (propertyId: number) => {
        const response = await api.get(
            `/hotel/room-types/list?property_id=${propertyId}`
        );

        setRoomTypes(response.data.data.data);
    };

    useEffect(() => {
        if (!selectedProperty) {
            setRoomTypes([]);
            setSelectedRoomType(null);
            setError("");
            return;
        }

        const loadRoomTypes = async () => {
            setLoading(true);
            setError("");
            setSelectedRoomType(null);

            try {
                await fetchRoomTypes(selectedProperty.id);
            } catch (error: any) {
                setRoomTypes([]);

                setError(
                    error?.response?.data?.message ||
                        "Failed to load room types."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoomTypes();
    }, [selectedProperty]);

    useEffect(() => {
        const previews = selectedImages.map((image) =>
            URL.createObjectURL(image)
        );

        setImagePreviews(previews);

        return () => {
            previews.forEach((preview) => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [selectedImages]);

    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
    };

    const handlePropertyRemove = () => {
        setSelectedProperty(null);
        setRoomTypes([]);
        setSelectedRoomType(null);
        setSelectedImages([]);
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);
    };

    const handleRoomTypeSelect = (roomType: RoomType) => {
        setSelectedRoomType(roomType);
        setSelectedImages([]);
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files) {
            return;
        }

        setSelectedImages(Array.from(e.target.files));
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);
    };

    const handleUpload = async () => {
        if (!selectedRoomType) {
            return;
        }

        if (selectedImages.length === 0) {
            setUploadError("Please select at least one image.");
            return;
        }

        setUploading(true);
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);

        try {
            const formData = new FormData();

            formData.append(
                "imageable_id",
                String(selectedRoomType.id)
            );

            formData.append(
                "imageable_type",
                "App\\Models\\RoomType"
            );

            selectedImages.forEach((image) => {
                formData.append("images[]", image);
            });

            const response = await api.post<UploadResponse>(
                "/images",
                formData
            );

            setUploadMessage(response.data.message);
            setSelectedImages([]);
            setImageErrors([]);
        } catch (error: any) {
            const errors =
                error?.response?.data?.image_errors || [];

            setImageErrors(errors);

            if (errors.length === 0) {
                setUploadError(
                    error?.response?.data?.message ||
                        "Failed to upload images."
                );
            } else {
                setUploadError("");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <SelectProperty
                selectedProperty={selectedProperty}
                onSelect={handlePropertySelect}
                onRemove={handlePropertyRemove}
            />

            {selectedProperty && (
                <div>
                    <h2>Room Types</h2>

                    {loading && (
                        <p>
                            Loading room types...
                        </p>
                    )}

                    {error && (
                        <p>
                            {error}
                        </p>
                    )}

                    {!loading &&
                        !error &&
                        roomTypes.length === 0 && (
                            <p>
                                No room types found.
                            </p>
                        )}

                    {!loading &&
                        roomTypes.length > 0 && (
                            <div>
                                {roomTypes.map((roomType) => (
                                    <div key={roomType.id}>
                                        <h3>
                                            {roomType.name}
                                        </h3>

                                        <p>
                                            Type: {roomType.type}
                                        </p>

                                        <p>
                                            Bedrooms:{" "}
                                            {roomType.bedroom}
                                        </p>

                                        <p>
                                            Max Occupancy:{" "}
                                            {roomType.max_occupancy}
                                        </p>

                                        <p>
                                            Status:{" "}
                                            {roomType.status}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoomTypeSelect(
                                                    roomType
                                                )
                                            }
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            )}

            {selectedRoomType && (
                <div>
                    <h2>
                        Selected Room Type
                    </h2>

                    <h3>
                        {selectedRoomType.name}
                    </h3>

                    <p>
                        Type: {selectedRoomType.type}
                    </p>

                    <p>
                        Bedrooms:{" "}
                        {selectedRoomType.bedroom}
                    </p>

                    <p>
                        Max Occupancy:{" "}
                        {selectedRoomType.max_occupancy}
                    </p>

                    <div>
                        <h3>
                            Upload Images
                        </h3>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />

                        {selectedImages.length > 0 && (
                            <div>
                                {selectedImages.map(
                                    (image, index) => {
                                        const imageError =
                                            imageErrors.find(
                                                (error) =>
                                                    error.index ===
                                                    index
                                            );

                                        return (
                                            <div key={index}>
                                                {imagePreviews[
                                                    index
                                                ] && (
                                                    <img
                                                        src={
                                                            imagePreviews[
                                                                index
                                                            ]
                                                        }
                                                        alt={
                                                            image.name
                                                        }
                                                        width={150}
                                                        height={150}
                                                    />
                                                )}

                                                <div>
                                                    {image.name}
                                                </div>

                                                {imageError &&
                                                    imageError.errors.map(
                                                        (
                                                            message,
                                                            errorIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    errorIndex
                                                                }
                                                            >
                                                                {
                                                                    message
                                                                }
                                                            </div>
                                                        )
                                                    )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {imageErrors.length === 0 &&
                            uploadError && (
                                <div>
                                    {uploadError}
                                </div>
                            )}

                        {uploadMessage && (
                            <div>
                                {uploadMessage}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={
                                uploading ||
                                selectedImages.length === 0
                            }
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Images"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddRomeTypeImages;