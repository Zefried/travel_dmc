// Step 1 — imports

import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";


// Step 2 — types

type VehicleAdmin = {
    id: number;
    name: string;
    phone: string;
    email: string;
};


type VehicleForm = {
    vehicle_admin_id: string;
    type: string;
    name: string;
    model: string;
    registration_no: string;
    seating_capacity: string;
    color: string;
    driver_name: string;
    driver_phone: string;
    status: string;
};


// Step 3 — component

const AddVehicle = () => {

    // Step 4 — state

    const [vehicleAdmins, setVehicleAdmins] =
        useState<VehicleAdmin[]>([]);

    const [form, setForm] = useState<VehicleForm>({
        vehicle_admin_id: "",
        type: "",
        name: "",
        model: "",
        registration_no: "",
        seating_capacity: "",
        color: "",
        driver_name: "",
        driver_phone: "",
        status: "active",
    });


    const [vehicleAdminsLoading, setVehicleAdminsLoading] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    const [vehicleAdminsError, setVehicleAdminsError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // Step 5 — functions

    const fetchVehicleAdmins = async () => {

        const response = await api.get(
            "/admin/vehicle-admins/list"
        );

        setVehicleAdmins(response.data.data);
    };


    const createVehicle = async () => {

        const response = await api.post(
            "/vehicle",
            {
                vehicle_admin_id:
                    Number(form.vehicle_admin_id),

                type: form.type || null,
                name: form.name || null,
                model: form.model || null,
                registration_no:
                    form.registration_no || null,

                seating_capacity:
                    form.seating_capacity
                        ? Number(form.seating_capacity)
                        : null,

                color: form.color || null,
                driver_name: form.driver_name || null,
                driver_phone: form.driver_phone || null,
                status: form.status || null,
            }
        );

        return response.data;
    };


    const resetForm = () => {

        setForm({
            vehicle_admin_id: "",
            type: "",
            name: "",
            model: "",
            registration_no: "",
            seating_capacity: "",
            color: "",
            driver_name: "",
            driver_phone: "",
            status: "active",
        });
    };


    // Step 6 — effects

    useEffect(() => {

        const loadVehicleAdmins = async () => {

            setVehicleAdminsLoading(true);
            setVehicleAdminsError("");

            try {

                await fetchVehicleAdmins();

            } catch (error: any) {

                setVehicleAdminsError(
                    error?.response?.data?.message ||
                    "Failed to load vehicle admins."
                );

            } finally {

                setVehicleAdminsLoading(false);
            }
        };

        loadVehicleAdmins();

    }, []);


    // Step 7 — handlers

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");


        if (!form.vehicle_admin_id) {

            setError(
                "Please select a vehicle admin."
            );

            setLoading(false);

            return;
        }


        try {

            const data = await createVehicle();

            setMessage(
                data.message ||
                "Vehicle created successfully."
            );

            resetForm();

        } catch (error: any) {

            const responseData =
                error?.response?.data;


            if (responseData?.errors) {

                const firstError =
                    Object.values(
                        responseData.errors
                    )
                        .flat()
                        .find(Boolean);


                setError(
                    String(
                        firstError ||
                        responseData.message ||
                        "Validation failed."
                    )
                );

            } else {

                setError(
                    responseData?.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // Step 8 — return()

    return (
        <div className="av-container">

            <div className="av-header">

                <h1 className="av-title">
                    Add Vehicle
                </h1>

                <p className="av-subtitle">
                    Add a new vehicle to the vehicle master.
                </p>

            </div>


            {vehicleAdminsLoading && (
                <p className="av-loading">
                    Loading vehicle admins...
                </p>
            )}


            {vehicleAdminsError && (
                <p className="av-error">
                    {vehicleAdminsError}
                </p>
            )}


            {!vehicleAdminsLoading &&
                !vehicleAdminsError && (

                    <form
                        className="av-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-vehicle-admin"
                            >
                                Vehicle Admin
                            </label>

                            <select
                                id="av-vehicle-admin"
                                name="vehicle_admin_id"
                                className="av-select"
                                value={
                                    form.vehicle_admin_id
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Vehicle Admin
                                </option>

                                {vehicleAdmins.map(
                                    (vehicleAdmin) => (

                                        <option
                                            key={
                                                vehicleAdmin.id
                                            }
                                            value={
                                                vehicleAdmin.id
                                            }
                                        >
                                            {
                                                vehicleAdmin.name
                                            }
                                            {" - "}
                                            {
                                                vehicleAdmin.phone
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-type"
                            >
                                Vehicle Type
                            </label>

                            <input
                                id="av-type"
                                name="type"
                                type="text"
                                className="av-input"
                                value={form.type}
                                onChange={handleChange}
                                placeholder="e.g. SUV"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-name"
                            >
                                Vehicle Name
                            </label>

                            <input
                                id="av-name"
                                name="name"
                                type="text"
                                className="av-input"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Airport Shuttle"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-model"
                            >
                                Model
                            </label>

                            <input
                                id="av-model"
                                name="model"
                                type="text"
                                className="av-input"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="e.g. Toyota Innova"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-registration-no"
                            >
                                Registration Number
                            </label>

                            <input
                                id="av-registration-no"
                                name="registration_no"
                                type="text"
                                className="av-input"
                                value={
                                    form.registration_no
                                }
                                onChange={handleChange}
                                placeholder="e.g. AS01AB1234"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-seating-capacity"
                            >
                                Seating Capacity
                            </label>

                            <input
                                id="av-seating-capacity"
                                name="seating_capacity"
                                type="number"
                                min="1"
                                className="av-input"
                                value={
                                    form.seating_capacity
                                }
                                onChange={handleChange}
                                placeholder="e.g. 7"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-color"
                            >
                                Color
                            </label>

                            <input
                                id="av-color"
                                name="color"
                                type="text"
                                className="av-input"
                                value={form.color}
                                onChange={handleChange}
                                placeholder="e.g. White"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-driver-name"
                            >
                                Driver Name
                            </label>

                            <input
                                id="av-driver-name"
                                name="driver_name"
                                type="text"
                                className="av-input"
                                value={form.driver_name}
                                onChange={handleChange}
                                placeholder="e.g. Rahim Ali"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-driver-phone"
                            >
                                Driver Phone
                            </label>

                            <input
                                id="av-driver-phone"
                                name="driver_phone"
                                type="text"
                                className="av-input"
                                value={
                                    form.driver_phone
                                }
                                onChange={handleChange}
                                placeholder="e.g. 9876543210"
                            />

                        </div>


                        <div className="av-field">

                            <label
                                className="av-label"
                                htmlFor="av-status"
                            >
                                Status
                            </label>

                            <select
                                id="av-status"
                                name="status"
                                className="av-select"
                                value={form.status}
                                onChange={handleChange}
                            >

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {message && (
                            <div className="av-success">
                                {message}
                            </div>
                        )}


                        {error && (
                            <div className="av-error">
                                {error}
                            </div>
                        )}


                        <button
                            type="submit"
                            className="av-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Vehicle"}
                        </button>

                    </form>
                )}

        </div>
    );
};


export default AddVehicle;