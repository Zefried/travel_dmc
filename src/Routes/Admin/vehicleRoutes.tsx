import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import { DashboardHome } from "../../Pages/Panels/DashboardHome";



export const adminVehicleRoutes = [
    {
        element: <Outlet />,
        children: [

            {
                path: "add-vehicle",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <DashboardHome />
                    </ProtectedRoute>
                ),
            },


        ],
    },
];