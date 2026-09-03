import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddVehicle from "../../Pages/Admin/Vehicle/Add/AddVehicle";
import ViewVehicle from "../../Pages/Admin/Vehicle/View/ViewVehicle";



export const adminVehicleRoutes = [
    {
        element: <Outlet />,
        children: [

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

        ],
    },
];