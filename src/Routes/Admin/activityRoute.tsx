import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddActivity from "../../Pages/Admin/Activity/Add/AddActivity";



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

            


        ],
    },
];