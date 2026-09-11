import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddActivity from "../../Pages/Admin/Activity/Add/AddActivity";
import AddActivityTransfer from "../../Pages/Admin/ActivityTransfer/Add/AddActivityTransfer";



export const activityRoutes = [
    {
        element: <Outlet />,
        children: [

            {
                path: "add-activity",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AddActivity />
                    </ProtectedRoute>
                ),
            },

            {
                path: "add-activity/transfers",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AddActivityTransfer />
                    </ProtectedRoute>
                ),
            },

            


        ],
    },
];