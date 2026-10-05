// Step 1 — imports

import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import Pagination from "../../../../Components/Pagination/Pagination";
import "./ViewVehicle.css";


// Step 2 — types

type VehicleAdmin = {
    id: number;
    name: string;
    phone: string;
    email: string;
};

type Vehicle = {
    id: number;
    vehicle_admin_id: number;
    type: string | null;
    name: string | null;
    model: string | null;
    registration_no: string | null;
    seating_capacity: number | null;
    color: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    status: string | null;
};


// Step 3 — component

const ViewVehicles = () => {

    // Step 4 — state

    const [vehicleAdmins, setVehicleAdmins] =
        useState<VehicleAdmin[]>([]);

    const [selectedVehicleAdminId, setSelectedVehicleAdminId] =
        useState<string>("");

    const [selectedVehicleAdmin, setSelectedVehicleAdmin] =
        useState<VehicleAdmin | null>(null);


    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);


    const [currentPage, setCurrentPage] =
        useState<number>(1);

    const [lastPage, setLastPage] =
        useState<number>(1);


    const [loading, setLoading] =
        useState(false);

    const [vehiclesLoading, setVehiclesLoading] =
        useState(false);


    const [error, setError] =
        useState("");

    const [vehiclesError, setVehiclesError] =
        useState("");


    // Step 5 — functions

    const fetchVehicleAdmins = async () => {

        const response = await api.get(
            "/admin/vehicle-admins/list"
        );

        setVehicleAdmins(response.data.data);
    };


    const fetchVehicles = async (
        vehicleAdminId: string,
        page: number
    ) => {

        const response = await api.get(
            "/vehicle/list",
            {
                params: {
                    vehicle_admin_id: vehicleAdminId,
                    page: page,
                },
            }
        );

        setVehicles(
            response.data.data.data
        );

        setCurrentPage(
            response.data.data.current_page
        );

        setLastPage(
            response.data.data.last_page
        );
    };


    // Step 6 — effects

    useEffect(() => {

        const loadVehicleAdmins = async () => {

            setLoading(true);
            setError("");

            try {

                await fetchVehicleAdmins();

            } catch (error: any) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to load vehicle admins."
                );

            } finally {

                setLoading(false);
            }
        };

        loadVehicleAdmins();

    }, []);


    // Step 7 — handlers

    const handleVehicleAdminChange = async (
        value: string
    ) => {

        setSelectedVehicleAdminId(value);

        setVehicles([]);

        setCurrentPage(1);
        setLastPage(1);

        setVehiclesError("");


        if (!value) {

            setSelectedVehicleAdmin(null);

            return;
        }


        const vehicleAdmin = vehicleAdmins.find(
            (admin) =>
                admin.id === Number(value)
        );


        if (!vehicleAdmin) {

            setSelectedVehicleAdmin(null);

            return;
        }


        setSelectedVehicleAdmin(
            vehicleAdmin
        );


        setVehiclesLoading(true);


        try {

            await fetchVehicles(
                value,
                1
            );

        } catch (error: any) {

            setVehicles([]);

            setVehiclesError(
                error?.response?.data?.message ||
                "Failed to load vehicles."
            );

        } finally {

            setVehiclesLoading(false);
        }
    };


    const handlePageChange = async (
        page: number
    ) => {

        if (
            page < 1 ||
            page > lastPage ||
            !selectedVehicleAdminId
        ) {
            return;
        }


        setVehiclesLoading(true);
        setVehiclesError("");


        try {

            await fetchVehicles(
                selectedVehicleAdminId,
                page
            );

        } catch (error: any) {

            setVehiclesError(
                error?.response?.data?.message ||
                "Failed to load vehicles."
            );

        } finally {

            setVehiclesLoading(false);
        }
    };


    // Step 8 — return()

    return (
        <main className="vv-page">

            <header className="vv-header"><p className="vv-eyebrow">Fleet directory</p><h1>
                Vehicles
            </h1><p>Review vehicles assigned to each vehicle admin.</p></header>


            {loading && (
                <p className="vv-state">
                    Loading vehicle admins...
                </p>
            )}


            {error && (
                <p className="vv-state vv-state--error">
                    {error}
                </p>
            )}


            {!loading && !error && (

                <>

                    <section className="vv-selector">

                        <label className="vv-label">
                            Vehicle Admin
                        </label>

                        <select className="vv-select"
                            value={
                                selectedVehicleAdminId
                            }
                            onChange={(e) =>
                                handleVehicleAdminChange(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Vehicle Admin
                            </option>


                            {vehicleAdmins.map(
                                (admin) => (

                                    <option
                                        key={admin.id}
                                        value={admin.id}
                                    >
                                        {admin.name} - {admin.phone}
                                    </option>

                                )
                            )}

                        </select>

                    </section>


                    {selectedVehicleAdmin && (

                        <section className="vv-admin-card">

                            <h2 className="vv-admin-title">
                                Vehicle Admin Details
                            </h2>

                            <p className="vv-admin-detail">
                                Name: {
                                    selectedVehicleAdmin.name
                                }
                            </p>

                            <p className="vv-admin-detail">
                                Phone: {
                                    selectedVehicleAdmin.phone
                                }
                            </p>

                            <p className="vv-admin-detail">
                                Email: {
                                    selectedVehicleAdmin.email
                                }
                            </p>

                        </section>
                    )}


                    {vehiclesLoading && (
                        <p className="vv-state">
                            Loading vehicles...
                        </p>
                    )}


                    {vehiclesError && (
                        <p className="vv-state vv-state--error">
                            {vehiclesError}
                        </p>
                    )}


                    {selectedVehicleAdmin &&
                        !vehiclesLoading &&
                        !vehiclesError &&
                        vehicles.length > 0 && (

                            <>

                                <div className="vv-table-wrap"><table className="vv-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Vehicle
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Model
                                            </th>

                                            <th>
                                                Registration No
                                            </th>

                                            <th>
                                                Seating Capacity
                                            </th>

                                            <th>
                                                Driver Phone
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {vehicles.map(
                                            (vehicle) => (

                                                <tr
                                                    key={
                                                        vehicle.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            vehicle.name ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.type ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.model ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.registration_no ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.seating_capacity ??
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.driver_phone ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            vehicle.status ||
                                                            "—"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table></div>


                                <Pagination
                                    currentPage={
                                        currentPage
                                    }
                                    lastPage={
                                        lastPage
                                    }
                                    onPageChange={
                                        handlePageChange
                                    }
                                />

                            </>
                        )}


                    {selectedVehicleAdmin &&
                        !vehiclesLoading &&
                        !vehiclesError &&
                        vehicles.length === 0 && (

                            <p className="vv-state vv-state--empty">
                                No vehicles found for this vehicle admin.
                            </p>
                        )}

                </>

            )}

        </main>
    );
};


export default ViewVehicles;
