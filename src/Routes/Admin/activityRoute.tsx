import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddActivity from "../../Pages/Admin/Activity/Add/AddActivity";
import AddActivityTransfer from "../../Pages/Admin/ActivityTransfer/Add/AddActivityTransfer";
import ViewActivities from "../../Pages/Admin/Activity/View/ViewActivities";
import ViewActivityTransfers from "../../Pages/Admin/ActivityTransfer/View/ViewActivityTransfers";



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

            {
                path: "view-activities",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewActivities />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-transfers",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewActivityTransfers />
                    </ProtectedRoute>
                ),
            },

        ],
    },
];
