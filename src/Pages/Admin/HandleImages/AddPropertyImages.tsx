import React, { useEffect, useState } from "react";
import api from "../../../api/axios";

type Property = {
    id: number;
    name: string;
    type: string;
    star_rating: number | null;
    description: string | null;
    address: string | null;
    postal_code: string;
    phone: string;
    email: string | null;
    website: string | null;
    status: string;
    country?: {
        id: number;
        name: string;
    };
    city?: {
        id: number;
        name: string;
    };
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

const AddPropertyImages = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [imageErrors, setImageErrors] = useState<ImageError[]>([]);

    const searchProperties = async (query: string) => {
        const response = await api.get(
            `/hotel/properties/for-room-configuration?query=${encodeURIComponent(
                query
            )}`
        );

        setProperties(response.data.data);
    };

    useEffect(() => {
        const query = searchQuery.trim();

        if (query.length < 3) {
            setProperties([]);
            setError("");
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                await searchProperties(query);
            } catch (error: any) {
                setProperties([]);

                setError(
                    error?.response?.data?.message ||
                        "Failed to search properties."
                );
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

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

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value);
        setSelectedProperty(null);
        setSelectedImages([]);
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);
    };

    const handleSelect = (property: Property) => {
        setSearchQuery("");
        setProperties([]);
        setError("");
        setSelectedProperty(property);
        setSelectedImages([]);
        setUploadMessage("");
        setUploadError("");
        setImageErrors([]);
    };

    const handleRemove = () => {
        setSearchQuery("");
        setProperties([]);
        setError("");
        setSelectedProperty(null);
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
        if (!selectedProperty) {
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
                String(selectedProperty.id)
            );

            formData.append(
                "imageable_type",
                "App\\Models\\Property"
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
            <h2>Property Images</h2>

            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter property name, phone or email"
            />

            {loading && <div>Searching...</div>}

            {error && <div>{error}</div>}

            {!loading &&
                !error &&
                properties.length === 0 &&
                searchQuery.trim().length >= 3 && (
                    <div>No properties found.</div>
                )}

            {properties.length > 0 && (
                <div>
                    {properties.map((property) => (
                        <div key={property.id}>
                            <div>
                                <h3>{property.name}</h3>

                                <p>
                                    {property.city?.name},{" "}
                                    {property.country?.name}
                                </p>

                                <p>{property.phone}</p>

                                {property.email && (
                                    <p>{property.email}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleSelect(property)
                                }
                            >
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedProperty && (
                <div>
                    <h3>Selected Property</h3>

                    <p>
                        <strong>Name:</strong>{" "}
                        {selectedProperty.name}
                    </p>

                    <p>
                        <strong>Type:</strong>{" "}
                        {selectedProperty.type}
                    </p>

                    <p>
                        <strong>Star Rating:</strong>{" "}
                        {selectedProperty.star_rating ?? "N/A"}
                    </p>

                    <p>
                        <strong>Address:</strong>{" "}
                        {selectedProperty.address ?? "N/A"}
                    </p>

                    <p>
                        <strong>City:</strong>{" "}
                        {selectedProperty.city?.name ?? "N/A"}
                    </p>

                    <p>
                        <strong>Country:</strong>{" "}
                        {selectedProperty.country?.name ?? "N/A"}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {selectedProperty.phone}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {selectedProperty.email ?? "N/A"}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {selectedProperty.status}
                    </p>

                    <button
                        type="button"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>

                    <div>
                        <h3>Upload Images</h3>

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
                                                {imagePreviews[index] && (
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
                                                                {message}
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
                                <div>{uploadError}</div>
                            )}

                        {uploadMessage && (
                            <div>{uploadMessage}</div>
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

export default AddPropertyImages;