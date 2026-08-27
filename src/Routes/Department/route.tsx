import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoutes";

export const departmentRoutes = [
  {
    element: <Outlet />, // no global restriction
    children: [
      {
        path: "agents",
        element: (
          <ProtectedRoute allowedRoles={['department', 'admin']}>
            <div>Department Agents</div>
          </ProtectedRoute>
        ),
      }
    ],
  },
];