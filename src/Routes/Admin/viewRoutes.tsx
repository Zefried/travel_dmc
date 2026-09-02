import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";

import ViewStates from "../../Pages/Admin/Locations/State/View/ViewStates";
import ViewAmenities from "../../Pages/Admin/Amenity/View/ViewAmenities";
import StateCountryFilter from "../../Pages/Admin/Locations/State/View/List/StateCountryFilter";


export const adminViewRoutes = [
    {
        element: <Outlet />,
        children: [
            {
                path: "states-search",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewStates />
                    </ProtectedRoute>
                ),
            },
            {
                path: "states",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <StateCountryFilter />
                    </ProtectedRoute>
                ),
            },
            {
                path: "amenities",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewAmenities />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];