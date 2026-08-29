import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AdminPanel from "../../Pages/Panels/AdminPanel";
import AddProperty from "../../Pages/Admin/Property/Add/AddProperty";
import AddCountry from "../../Pages/Admin/Locations/Country/Add/AddCountry";
import AddState from "../../Pages/Admin/Locations/State/Add/AddState";


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
      // location root ends here
     
    ],
  },
];