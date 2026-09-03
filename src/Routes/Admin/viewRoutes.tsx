import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";

import ViewStates from "../../Pages/Admin/Locations/State/View/ViewStates";
import ViewAmenities from "../../Pages/Admin/Amenity/View/ViewAmenities";
import StateCountryFilter from "../../Pages/Admin/Locations/State/View/List/StateCountryFilter";
import CityList from "../../Pages/Admin/Locations/City/View/CityList";
import ViewCities from "../../Pages/Admin/Locations/City/View/ViewCities";
import PropertyList from "../../Pages/Admin/Property/View/PropertyList";
import PropertyDetails from "../../Pages/Admin/Property/View/PropertyDetails";
import RoomTypeList from "../../Pages/Admin/RoomType/View/RoomTypeList";
import RoomTypeDetails from "../../Pages/Admin/RoomType/View/RoomTypeDetails";
import RoomList from "../../Pages/Admin/Rooms/View/RoomList";
import ViewBedConfig from "../../Pages/Admin/RoomConfig/View/ViewBedConfig";
import ViewMealConfig from "../../Pages/Admin/RoomConfig/View/ViewMealConfig";


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
                path: "Properties",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <PropertyList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "properties/details/:id",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <PropertyDetails />
                    </ProtectedRoute>
                ),
            },


            {
                path: "room-types",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <RoomTypeList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "room-type/details/:id",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <RoomTypeDetails />
                    </ProtectedRoute>
                ),
            },
            {
                path: "rooms",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <RoomList />
                    </ProtectedRoute>
                ),
            },


            {
                path: "view-bed-config",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewBedConfig />
                    </ProtectedRoute>
                ),
            },
  {
                path: "view-Meal-config",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ViewMealConfig />
                    </ProtectedRoute>
                ),
            },











        ],


    },
];