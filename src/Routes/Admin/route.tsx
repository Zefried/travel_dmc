import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AdminPanel from "../../Pages/Panels/AdminPanel";
import AddProperty from "../../Pages/Admin/Property/Add/AddProperty";
import AddCountry from "../../Pages/Admin/Locations/Country/Add/AddCountry";
import AddState from "../../Pages/Admin/Locations/State/Add/AddState";
import AddCity from "../../Pages/Admin/Locations/City/Add/AddCity";
import AddTeam from "../../Pages/Admin/Team/Add/AddTeam";
import AddRoomType from "../../Pages/Admin/RoomType/Add/AddRoomType";
import AddRoom from "../../Pages/Admin/Rooms/Add/AddRoom";


export const adminRoutes = [
  {
    element: <Outlet />, // no global restriction
    children: [
      {
        path: "admin", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "test", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddProperty />
          </ProtectedRoute>
        ),
      },
      // location routes
      {
        path: "add-country", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddCountry />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-state", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddState />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-city", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddCity />
          </ProtectedRoute>
        ),
      },
      // location root ends here

      // Property routes
      {
        path: "add-property", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddProperty />
          </ProtectedRoute>
        ),
      },
      // Property root ends here

      // RoomType routes
      {
        path: "add-room-type", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddRoomType />
          </ProtectedRoute>
        ),
      },
      // RoomType root ends here

       // Rooms routes
      {
        path: "add-room", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddRoom />
          </ProtectedRoute>
        ),
      },
      // Room root ends here

      // Manage team routes
      {
        path: "add-team", // this becomes dashboard home for admin users
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AddTeam />
          </ProtectedRoute>
        ),
      },
      // Team routes ends here
     
    ],
  },
];