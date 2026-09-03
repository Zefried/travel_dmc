// Step 1 — imports

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios";
import EditableField from "../../../../Components/EditableField/EditableField";
import './Style/PropertyDetail.css';


// Step 2 — types

type Location = {
    id: number;
    name: string;
};

type Property = {
    id: number;
    hotel_admin_id: number;
    country_id: number;
    state_id: number;
    city_id: number;
    name: string;
    type: string;
    star_rating: number;
    description: string | null;
    address: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    phone: string;
    alternative_phone: string | null;
    email: string;
    website: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    country: Location;
    state: Location;
    city: Location;
};

type EditableField =
    | "name"
    | "type"
    | "star_rating"
    | "description"
    | "address"
    | "postal_code"
    | "latitude"
    | "longitude"
    | "phone"
    | "alternative_phone"
    | "email"
    | "website"
    | "status";

type EditableFieldConfig = {
    key: EditableField;
    label: string;
    type?: "text" | "number" | "email" | "url" | "textarea";
};


// Step 3 — component

const PropertyDetails = () => {

    // Step 4 — state

    const { id } = useParams<{ id: string }>();

    const [property, setProperty] = useState<Property | null>(null);

    const [editingField, setEditingField] =
        useState<EditableField | null>(null);

    const [editValue, setEditValue] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");
    const [updateError, setUpdateError] = useState("");


    // Step 5 — functions

    const fetchProperty = async () => {

        if (!id) {
            setError("Property ID is missing.");
            return;
        }

        const response = await api.get(
            `/hotel/properties/${id}`
        );

        setProperty(response.data.data);
    };


    const updatePropertyField = async (
        field: EditableField,
        value: string
    ) => {

        if (!property) {
            return;
        }

        if (!value.trim() && field !== "alternative_phone") {
            setUpdateError(
                `${field} is required.`
            );
            return;
        }

        setUpdating(true);
        setUpdateError("");

        try {

            const payload: Record<string, string | number | null> = {};

            if (field === "star_rating") {

                payload[field] = Number(value);

            } else if (
                field === "alternative_phone" ||
                field === "website" ||
                field === "description"
            ) {

                payload[field] = value.trim() || null;

            } else {

                payload[field] = value.trim();
            }

            await api.patch(
                `/hotel/properties/${property.id}`,
                payload
            );

            await fetchProperty();

            setEditingField(null);
            setEditValue("");

        } catch (error: any) {

            setUpdateError(
                error?.response?.data?.message ||
                "Failed to update property."
            );

        } finally {

            setUpdating(false);
        }
    };


    // Step 6 — effects

    useEffect(() => {

        const loadProperty = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchProperty();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load property details."
                );

            } finally {

                setLoading(false);
            }
        };

        loadProperty();

    }, [id]);


    // Step 7 — handlers

    const handleEditClick = (
        field: EditableField
    ) => {

        if (!property) {
            return;
        }

        setUpdateError("");
        setEditingField(field);

        const currentValue = property[field];

        setEditValue(
            currentValue === null
                ? ""
                : String(currentValue)
        );
    };


    const handleCancelEdit = () => {

        setEditingField(null);
        setEditValue("");
        setUpdateError("");
    };


    // Step 8 — field configuration

    const editableFields: EditableFieldConfig[] = [
        {
            key: "name",
            label: "Property Name",
        },
        {
            key: "type",
            label: "Type",
        },
        {
            key: "star_rating",
            label: "Star Rating",
            type: "number",
        },
        {
            key: "description",
            label: "Description",
            type: "textarea",
        },
        {
            key: "address",
            label: "Address",
        },
        {
            key: "postal_code",
            label: "Postal Code",
        },
        {
            key: "latitude",
            label: "Latitude",
        },
        {
            key: "longitude",
            label: "Longitude",
        },
        {
            key: "phone",
            label: "Phone",
        },
        {
            key: "alternative_phone",
            label: "Alternative Phone",
        },
        {
            key: "email",
            label: "Email",
            type: "email",
        },
        {
            key: "website",
            label: "Website",
            type: "url",
        },
        {
            key: "status",
            label: "Status",
        },
    ];


    // Step 9 — return()

    return (
    <div className="pd-container">

        <div className="pd-header">

            <h1 className="pd-title">
                Property Details
            </h1>

        </div>


        {loading && (
            <p className="pd-loading">
                Loading property...
            </p>
        )}


        {error && (
            <p className="pd-error">
                {error}
            </p>
        )}


        {updateError && (
            <p className="pd-update-error">
                {updateError}
            </p>
        )}


        {!loading && !error && property && (

            <div className="pd-content">

                <div className="pd-property-header">

                    <h2 className="pd-property-name">
                        {property.name}
                    </h2>

                </div>


                <div className="pd-editable-fields">

                    {editableFields.map((field) => (

                        <EditableField
                            key={field.key}
                            label={field.label}
                            value={
                                property[field.key] === null
                                    ? ""
                                    : String(property[field.key])
                            }
                            editValue={editValue}
                            isEditing={
                                editingField === field.key
                            }
                            updating={updating}
                            type={field.type}
                            onEditValueChange={setEditValue}
                            onEditClick={() =>
                                handleEditClick(field.key)
                            }
                            onSave={() =>
                                updatePropertyField(
                                    field.key,
                                    editValue
                                )
                            }
                            onCancel={handleCancelEdit}
                        />

                    ))}

                </div>


                <div className="pd-readonly-section">

                    <div className="pd-readonly-field">

                        <span className="pd-readonly-label">
                            Country
                        </span>

                        <span className="pd-readonly-value">
                            {property.country.name}
                        </span>

                    </div>


                    <div className="pd-readonly-field">

                        <span className="pd-readonly-label">
                            State
                        </span>

                        <span className="pd-readonly-value">
                            {property.state.name}
                        </span>

                    </div>


                    <div className="pd-readonly-field">

                        <span className="pd-readonly-label">
                            City
                        </span>

                        <span className="pd-readonly-value">
                            {property.city.name}
                        </span>

                    </div>

                </div>


                <div className="pd-metadata-section">

                    <div className="pd-metadata-field">

                        <span className="pd-metadata-label">
                            Property ID
                        </span>

                        <span className="pd-metadata-value">
                            {property.id}
                        </span>

                    </div>


                    <div className="pd-metadata-field">

                        <span className="pd-metadata-label">
                            Hotel Admin ID
                        </span>

                        <span className="pd-metadata-value">
                            {property.hotel_admin_id}
                        </span>

                    </div>


                    <div className="pd-metadata-field">

                        <span className="pd-metadata-label">
                            Created At
                        </span>

                        <span className="pd-metadata-value">
                            {property.created_at}
                        </span>

                    </div>


                    <div className="pd-metadata-field">

                        <span className="pd-metadata-label">
                            Updated At
                        </span>

                        <span className="pd-metadata-value">
                            {property.updated_at}
                        </span>

                    </div>

                </div>

            </div>
        )}

    </div>
    );
};


export default PropertyDetails;