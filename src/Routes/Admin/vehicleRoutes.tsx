import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddVehicle from "../../Pages/Admin/Vehicle/Add/AddVehicle";
import ViewVehicle from "../../Pages/Admin/Vehicle/View/ViewVehicle";
import VehiclePanelDB from "../../Pages/Panels/VehiclePanelDB";
import RequestVehicleBooking from "../../Pages/Admin/Vehicle/RequestBooking/RequestVehicleBooking";
import RequestBookingStatus from "../../Pages/Admin/Vehicle/RequestBookingStatus/RequestBookingStatus";

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
                path: "request-vehicle-booking",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <RequestVehicleBooking />
                    </ProtectedRoute>
                ),
            },
            {
                path: "vehicle-booking-status",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <RequestBookingStatus />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
