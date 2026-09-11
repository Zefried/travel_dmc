import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AddPropertyImages from "../../Pages/Admin/HandleImages/AddPropertyImages";
import AddRoomTypeImages from "../../Pages/Admin/HandleImages/AddRoomTypeImages";
import ViewPropertyImages from "../../Pages/Admin/HandleImages/ViewPropertyImages";
import ViewRoomTypeImages from "../../Pages/Admin/HandleImages/ViewRoomTypeImages";


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

            {
                path: "room-type-images",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "hotel_admin"]}>
                        <AddRoomTypeImages />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-property-images",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "hotel_admin"]}>
                        <ViewPropertyImages />
                    </ProtectedRoute>
                ),
            },

            {
                path: "view-room-type-images",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "hotel_admin"]}>
                        <ViewRoomTypeImages />
                    </ProtectedRoute>
                ),
            },

        ],
    },
];
