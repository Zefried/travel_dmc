import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddPropertyImages from "../../Pages/Admin/HandleImages/AddPropertyImages";


export const imageRoutes = [
    {
        element: <Outlet />,
        children: [

            {
                path: "property-images",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "hotel_admin"]}>
                        <AddPropertyImages />
                    </ProtectedRoute>
                ),
            },

        ],
    },
];