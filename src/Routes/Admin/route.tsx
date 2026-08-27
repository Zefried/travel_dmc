import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";
import AdminPanel from "../../Pages/Panels/AdminPanel";
import Properties from "../../AddProptery";


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
            <Properties />
          </ProtectedRoute>
        ),
      },
     
    ],
  },
];