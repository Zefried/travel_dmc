import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import MarkBusy from "../../Pages/VehicleAdmin/MarkBusy/MarkBusy";
import ViewBusy from "../../Pages/VehicleAdmin/ViewBusy/ViewBusy";

export const vehicleAdminRoutes = [
    {
        element: <Outlet />,
        children: [
            {
                path: "mark-busy",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "vehicle_admin"]}>
                        <MarkBusy />
                    </ProtectedRoute>
                ),
            },
            {
                path: "view-busy",
                element: (
                    <ProtectedRoute allowedRoles={["vehicle_admin"]}>
                        <ViewBusy />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
