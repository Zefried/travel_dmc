// Step 1 — imports

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/axios";
import EditableField from "../../../../Components/EditableField/EditableField";


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
    description: string | null;
    default_bed_type: string;
    default_bed_quantity: number;
    base_price: string;
    status: string;
    created_at: string;
    updated_at: string;
};

type EditableField =
    | "name"
    | "type"
    | "bedroom"
    | "size"
    | "size_unit"
    | "max_adults"
    | "max_children"
    | "max_occupancy"
    | "view"
    | "description"
    | "default_bed_type"
    | "default_bed_quantity"
    | "base_price"
    | "status";

type EditableFieldConfig = {
    key: EditableField;
    label: string;
    type?: "text" | "number" | "url" | "email" | "textarea";
};


// Step 3 — component

const RoomTypeDetails = () => {

    // Step 4 — state

    const { id } = useParams<{ id: string }>();

    const [roomType, setRoomType] = useState<RoomType | null>(null);

    const [editingField, setEditingField] =
        useState<EditableField | null>(null);

    const [editValue, setEditValue] = useState("");

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");
    const [updateError, setUpdateError] = useState("");


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


    const updateRoomTypeField = async (
        field: EditableField,
        value: string
    ) => {

        if (!roomType) {
            return;
        }

        if (!value.trim()) {

            setUpdateError(
                `${field} is required.`
            );

            return;
        }

        setUpdating(true);
        setUpdateError("");

        try {

            const payload: Record<
                string,
                string | number | null
            > = {};

            if (
                field === "bedroom" ||
                field === "max_adults" ||
                field === "max_children" ||
                field === "max_occupancy" ||
                field === "default_bed_quantity"
            ) {

                payload[field] = Number(value);

            } else if (
                field === "description"
            ) {

                payload[field] =
                    value.trim() || null;

            } else if (
                field === "base_price" ||
                field === "size"
            ) {

                payload[field] = value.trim();

            } else {

                payload[field] = value.trim();
            }

            const response = await api.patch(
                `/hotel/room-types/${roomType.id}`,
                payload
            );

            setRoomType(response.data.data);

            setEditingField(null);
            setEditValue("");

        } catch (error: any) {

            setUpdateError(
                error?.response?.data?.message ||
                "Failed to update room type."
            );

        } finally {

            setUpdating(false);
        }
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


    // Step 7 — handlers

    const handleEditClick = (
        field: EditableField
    ) => {

        if (!roomType) {
            return;
        }

        setUpdateError("");
        setEditingField(field);

        const currentValue = roomType[field];

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
            label: "Room Type Name",
        },

        {
            key: "type",
            label: "Type",
        },

        {
            key: "bedroom",
            label: "Bedrooms",
            type: "number",
        },

        {
            key: "size",
            label: "Size",
        },

        {
            key: "size_unit",
            label: "Size Unit",
        },

        {
            key: "max_adults",
            label: "Max Adults",
            type: "number",
        },

        {
            key: "max_children",
            label: "Max Children",
            type: "number",
        },

        {
            key: "max_occupancy",
            label: "Max Occupancy",
            type: "number",
        },

        {
            key: "view",
            label: "View",
        },

        {
            key: "description",
            label: "Description",
            type: "textarea",
        },

        {
            key: "default_bed_type",
            label: "Default Bed Type",
        },

        {
            key: "default_bed_quantity",
            label: "Default Bed Quantity",
            type: "number",
        },

        {
            key: "base_price",
            label: "Base Price",
        },

        {
            key: "status",
            label: "Status",
        },
    ];


    // Step 9 — return()

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


            {updateError && (
                <p>
                    {updateError}
                </p>
            )}


            {!loading && !error && roomType && (

                <div>

                    <h2>
                        {roomType.name}
                    </h2>


                    {editableFields.map((field) => (

                        <EditableField
                            key={field.key}
                            label={field.label}
                            value={
                                roomType[field.key] === null
                                    ? ""
                                    : String(roomType[field.key])
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
                                updateRoomTypeField(
                                    field.key,
                                    editValue
                                )
                            }
                            onCancel={handleCancelEdit}
                        />

                    ))}


                    <div>

                        <strong>
                            Property ID
                        </strong>

                        <span>
                            {" "}{roomType.property_id}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Room Type ID
                        </strong>

                        <span>
                            {" "}{roomType.id}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Created At
                        </strong>

                        <span>
                            {" "}{roomType.created_at}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Updated At
                        </strong>

                        <span>
                            {" "}{roomType.updated_at}
                        </span>

                    </div>

                </div>
            )}

        </div>
    );
};


export default RoomTypeDetails;