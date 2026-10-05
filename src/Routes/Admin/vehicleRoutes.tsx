import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddVehicle from "../../Pages/Admin/Vehicle/Add/AddVehicle";
import ViewVehicle from "../../Pages/Admin/Vehicle/View/ViewVehicle";
import VehiclePanelDB from "../../Pages/Panels/VehiclePanelDB";
import VehicleCalendar from "../../Pages/Admin/Vehicle/Calendar/VehicleCalendar";
import VehicleSchedule from "../../Pages/Admin/Vehicle/Schedule/VehicleSchedule";
import VehicleAvailability from "../../Pages/Admin/Vehicle/Availability/VehicleAvailability";
import VehicleBookings from "../../Pages/Admin/Vehicle/Bookings/VehicleBookings";

export const adminVehicleRoutes = [
    {
        element: <Outlet />,
        children: [

            {
                path: "vehicle-admin",
                element: (
                    <ProtectedRoute allowedRoles={["vehicle_admin"]}>
                        <VehiclePanelDB />
                    </ProtectedRoute>
                ),
            },

            {
                path: "add-vehicles",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AddVehicle />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-vehicles",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewVehicle />
                    </ProtectedRoute>
                ),
            },

            {
                path: "vehicle-availability",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <VehicleAvailability />
                    </ProtectedRoute>
                ),
            },

            {
                path: "vehicle-schedule",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "vehicle_admin"]}>
                        <VehicleCalendar />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-schedule",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "vehicle_admin"]}>
                        <VehicleSchedule />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-bookings",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "vehicle_admin"]}>
                        <VehicleBookings />
                    </ProtectedRoute>
                ),
            },

        ],
    },
];
