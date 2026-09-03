// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";


// Step 2 — types

type HotelAdmin = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

type Property = {
    id: number;
    name: string;
};

type RoomType = {
    id: number;
    property_id: number;
    name: string;
};

type MealConfiguration = {
    id: number;
    room_type_id: number;
    type: string;
    name: string;
    description: string | null;
    meal_code: string | null;
    extra_price: string;
    status: string;
    created_at: string;
    updated_at: string;
};


// Step 3 — component

const ViewMealConfig = () => {

    // Step 4 — state

    const [hotelAdmins, setHotelAdmins] =
        useState<HotelAdmin[]>([]);

    const [selectedHotelAdminId, setSelectedHotelAdminId] =
        useState("");

    const [properties, setProperties] =
        useState<Property[]>([]);

    const [selectedPropertyId, setSelectedPropertyId] =
        useState("");

    const [roomTypes, setRoomTypes] =
        useState<RoomType[]>([]);

    const [selectedRoomTypeId, setSelectedRoomTypeId] =
        useState("");

    const [mealConfigurations, setMealConfigurations] =
        useState<MealConfiguration[]>([]);


    const [editingConfigurationId, setEditingConfigurationId] =
        useState<number | null>(null);

    const [editName, setEditName] =
        useState("");

    const [editMealCode, setEditMealCode] =
        useState("");

    const [editDescription, setEditDescription] =
        useState("");

    const [editExtraPrice, setEditExtraPrice] =
        useState("");

    const [editStatus, setEditStatus] =
        useState("active");


    const [loading, setLoading] =
        useState(false);

    const [propertiesLoading, setPropertiesLoading] =
        useState(false);

    const [roomTypesLoading, setRoomTypesLoading] =
        useState(false);

    const [mealConfigurationsLoading, setMealConfigurationsLoading] =
        useState(false);

    const [updating, setUpdating] =
        useState(false);


    const [error, setError] =
        useState("");

    const [propertiesError, setPropertiesError] =
        useState("");

    const [roomTypesError, setRoomTypesError] =
        useState("");

    const [mealConfigurationsError, setMealConfigurationsError] =
        useState("");

    const [updateError, setUpdateError] =
        useState("");


    // Step 5 — functions

    const fetchHotelAdmins = async () => {

        const response = await api.get(
            "/admin/hotel-admins/list"
        );

        setHotelAdmins(response.data.data);
    };


    const fetchProperties = async (
        hotelAdminId: string
    ) => {

        const response = await api.get(
            "/hotel/properties/options",
            {
                params: {
                    hotel_admin_id: hotelAdminId,
                },
            }
        );

        setProperties(response.data.data);
    };


    const fetchRoomTypes = async (
        propertyId: string
    ) => {

        const response = await api.get(
            "/admin/room-types/list",
            {
                params: {
                    property_id: propertyId,
                },
            }
        );

        setRoomTypes(response.data.data);
    };


    const fetchMealConfigurations = async (
        roomTypeId: string
    ) => {

        const response = await api.get(
            "/hotel/room-configurations/list",
            {
                params: {
                    room_type_id: roomTypeId,
                    type: "meal",
                },
            }
        );

        setMealConfigurations(response.data.data);
    };


    const updateMealConfiguration = async (
        configurationId: number
    ) => {

        const configuration = mealConfigurations.find(
            (configuration) =>
                configuration.id === configurationId
        );

        if (!configuration) {
            return;
        }

        if (!editName.trim()) {

            setUpdateError(
                "Configuration name is required."
            );

            return;
        }

        setUpdating(true);
        setUpdateError("");

        try {

            const response = await api.patch(
                `/hotel/room-configurations/${configurationId}`,
                {
                    name: editName.trim(),
                    meal_code: editMealCode.trim() || null,
                    description: editDescription.trim() || null,
                    extra_price: editExtraPrice.trim() || null,
                    status: editStatus,
                }
            );

            const updatedConfiguration: MealConfiguration = {
                ...configuration,
                ...response.data.data,
            };

            setMealConfigurations(
                (currentConfigurations) =>
                    currentConfigurations.map(
                        (currentConfiguration) =>
                            currentConfiguration.id ===
                            configurationId
                                ? updatedConfiguration
                                : currentConfiguration
                    )
            );

            handleCancelEdit();

        } catch (error: any) {

            setUpdateError(
                error?.response?.data?.message ||
                "Failed to update meal configuration."
            );

        } finally {

            setUpdating(false);
        }
    };


    // Step 6 — effects

    useEffect(() => {

        const loadHotelAdmins = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchHotelAdmins();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load hotel admins."
                );

            } finally {

                setLoading(false);
            }
        };

        loadHotelAdmins();

    }, []);


    // Step 7 — handlers

    const handleHotelAdminChange = async (
        value: string
    ) => {

        setSelectedHotelAdminId(value);

        setSelectedPropertyId("");
        setSelectedRoomTypeId("");

        setProperties([]);
        setRoomTypes([]);
        setMealConfigurations([]);

        setPropertiesError("");
        setRoomTypesError("");
        setMealConfigurationsError("");
        setUpdateError("");

        handleCancelEdit();

        if (!value) {
            return;
        }

        setPropertiesLoading(true);

        try {

            await fetchProperties(value);

        } catch (error: any) {

            setProperties([]);

            setPropertiesError(
                error?.response?.data?.message ||
                "Failed to load properties."
            );

        } finally {

            setPropertiesLoading(false);
        }
    };


    const handlePropertyChange = async (
        value: string
    ) => {

        setSelectedPropertyId(value);

        setSelectedRoomTypeId("");

        setRoomTypes([]);
        setMealConfigurations([]);

        setRoomTypesError("");
        setMealConfigurationsError("");
        setUpdateError("");

        handleCancelEdit();

        if (!value) {
            return;
        }

        setRoomTypesLoading(true);

        try {

            await fetchRoomTypes(value);

        } catch (error: any) {

            setRoomTypes([]);

            setRoomTypesError(
                error?.response?.data?.message ||
                "Failed to load room types."
            );

        } finally {

            setRoomTypesLoading(false);
        }
    };


    const handleRoomTypeChange = async (
        value: string
    ) => {

        setSelectedRoomTypeId(value);

        setMealConfigurations([]);

        setMealConfigurationsError("");
        setUpdateError("");

        handleCancelEdit();

        if (!value) {
            return;
        }

        setMealConfigurationsLoading(true);

        try {

            await fetchMealConfigurations(value);

        } catch (error: any) {

            setMealConfigurations([]);

            setMealConfigurationsError(
                error?.response?.data?.message ||
                "Failed to load meal configurations."
            );

        } finally {

            setMealConfigurationsLoading(false);
        }
    };


    const handleEditClick = (
        configuration: MealConfiguration
    ) => {

        setEditingConfigurationId(
            configuration.id
        );

        setEditName(
            configuration.name
        );

        setEditMealCode(
            configuration.meal_code || ""
        );

        setEditDescription(
            configuration.description || ""
        );

        setEditExtraPrice(
            configuration.extra_price || ""
        );

        setEditStatus(
            configuration.status
        );

        setUpdateError("");
    };


    const handleCancelEdit = () => {

        setEditingConfigurationId(null);

        setEditName("");
        setEditMealCode("");
        setEditDescription("");
        setEditExtraPrice("");
        setEditStatus("active");

        setUpdateError("");
    };


    // Step 8 — return()

    return (
        <div>

            <h1>
                Meal Configurations
            </h1>


            {loading && (
                <p>
                    Loading hotel admins...
                </p>
            )}


            {error && (
                <p>
                    {error}
                </p>
            )}


            {!loading && !error && (

                <>

                    <div>

                        <label>
                            Hotel Admin
                        </label>

                        <select
                            value={selectedHotelAdminId}
                            onChange={(e) =>
                                handleHotelAdminChange(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Hotel Admin
                            </option>

                            {hotelAdmins.map((admin) => (

                                <option
                                    key={admin.id}
                                    value={admin.id}
                                >
                                    {admin.name} - {admin.phone}
                                </option>

                            ))}

                        </select>

                    </div>


                    {propertiesLoading && (
                        <p>
                            Loading properties...
                        </p>
                    )}


                    {propertiesError && (
                        <p>
                            {propertiesError}
                        </p>
                    )}


                    {selectedHotelAdminId &&
                        !propertiesLoading &&
                        !propertiesError && (

                            <div>

                                <label>
                                    Property
                                </label>

                                <select
                                    value={selectedPropertyId}
                                    onChange={(e) =>
                                        handlePropertyChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Property
                                    </option>

                                    {properties.map((property) => (

                                        <option
                                            key={property.id}
                                            value={property.id}
                                        >
                                            {property.name}
                                        </option>

                                    ))}

                                </select>

                            </div>
                        )}


                    {roomTypesLoading && (
                        <p>
                            Loading room types...
                        </p>
                    )}


                    {roomTypesError && (
                        <p>
                            {roomTypesError}
                        </p>
                    )}


                    {selectedPropertyId &&
                        !roomTypesLoading &&
                        !roomTypesError && (

                            <div>

                                <label>
                                    Room Type
                                </label>

                                <select
                                    value={selectedRoomTypeId}
                                    onChange={(e) =>
                                        handleRoomTypeChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Room Type
                                    </option>

                                    {roomTypes.map((roomType) => (

                                        <option
                                            key={roomType.id}
                                            value={roomType.id}
                                        >
                                            {roomType.name}
                                        </option>

                                    ))}

                                </select>

                            </div>
                        )}


                    {mealConfigurationsLoading && (
                        <p>
                            Loading meal configurations...
                        </p>
                    )}


                    {mealConfigurationsError && (
                        <p>
                            {mealConfigurationsError}
                        </p>
                    )}


                    {updateError && (
                        <p>
                            {updateError}
                        </p>
                    )}


                    {selectedRoomTypeId &&
                        !mealConfigurationsLoading &&
                        !mealConfigurationsError &&
                        mealConfigurations.length > 0 && (

                            <div>

                                <h2>
                                    Meal Configurations
                                </h2>


                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Configuration
                                            </th>

                                            <th>
                                                Meal Code
                                            </th>

                                            <th>
                                                Description
                                            </th>

                                            <th>
                                                Extra Price
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {mealConfigurations.map(
                                            (configuration) => (

                                                <tr
                                                    key={
                                                        configuration.id
                                                    }
                                                >

                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <input
                                                                type="text"
                                                                value={
                                                                    editName
                                                                }
                                                                onChange={(e) =>
                                                                    setEditName(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating
                                                                }
                                                            />

                                                        ) : (

                                                            configuration.name

                                                        )}

                                                    </td>


                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <input
                                                                type="text"
                                                                value={
                                                                    editMealCode
                                                                }
                                                                onChange={(e) =>
                                                                    setEditMealCode(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating
                                                                }
                                                            />

                                                        ) : (

                                                            configuration.meal_code ||
                                                            "—"

                                                        )}

                                                    </td>


                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <textarea
                                                                value={
                                                                    editDescription
                                                                }
                                                                onChange={(e) =>
                                                                    setEditDescription(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating
                                                                }
                                                            />

                                                        ) : (

                                                            configuration.description ||
                                                            "—"

                                                        )}

                                                    </td>


                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    editExtraPrice
                                                                }
                                                                onChange={(e) =>
                                                                    setEditExtraPrice(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating
                                                                }
                                                            />

                                                        ) : (

                                                            configuration.extra_price

                                                        )}

                                                    </td>


                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <select
                                                                value={
                                                                    editStatus
                                                                }
                                                                onChange={(e) =>
                                                                    setEditStatus(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    updating
                                                                }
                                                            >

                                                                <option value="active">
                                                                    Active
                                                                </option>

                                                                <option value="inactive">
                                                                    Inactive
                                                                </option>

                                                            </select>

                                                        ) : (

                                                            configuration.status

                                                        )}

                                                    </td>


                                                    <td>

                                                        {editingConfigurationId ===
                                                        configuration.id ? (

                                                            <>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateMealConfiguration(
                                                                            configuration.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                >
                                                                    {updating
                                                                        ? "Saving..."
                                                                        : "Save"}
                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleCancelEdit
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                >
                                                                    Cancel
                                                                </button>

                                                            </>

                                                        ) : (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        configuration
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}


                    {!mealConfigurationsLoading &&
                        !mealConfigurationsError &&
                        selectedRoomTypeId &&
                        mealConfigurations.length === 0 && (

                            <p>
                                No meal configurations found for this room type.
                            </p>
                        )}

                </>

            )}

        </div>
    );
};


export default ViewMealConfig;