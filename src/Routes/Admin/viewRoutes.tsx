import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";

import ViewStates from "../../Pages/Admin/Locations/State/View/ViewStates";
import ViewAmenities from "../../Pages/Admin/Amenity/View/ViewAmenities";
import StateCountryFilter from "../../Pages/Admin/Locations/State/View/List/StateCountryFilter";
import CityList from "../../Pages/Admin/Locations/City/View/CityList";
import ViewCities from "../../Pages/Admin/Locations/City/View/ViewCities";
import PropertyList from "../../Pages/Admin/Property/View/PropertyList";


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
                path: "cities",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CityList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "city-search",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewCities />
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










             {
                path: "test",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <PropertyList />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];