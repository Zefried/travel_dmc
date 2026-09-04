import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { Login } from "../Pages/Auth/Login";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Unauthorized } from "../Pages/Auth/Unauthorized";
import { DashboardHome } from "../Pages/Panels/DashboardHome";
import { departmentRoutes } from "./Department/route";
import { adminRoutes } from "./Admin/route";
import PackageBuilderPage from "../Pages/Website/PackageBuilder/PackageBuilderPage";
import AgentSearch from "../Pages/Website/Home/AgentSearch";
import { adminViewRoutes } from "./Admin/viewRoutes";
import { adminVehicleRoutes } from "./Admin/vehicleRoutes";
import { activityRoutes } from "./Admin/activityRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <AgentSearch />,
  },
 
  {
    path: "/package-builder",
    element: <PackageBuilderPage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin", "subadmin", "agent"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      
      // plug modular routes
      ...adminRoutes,
      ...adminViewRoutes,
      ...departmentRoutes,
      ...adminVehicleRoutes,
      ...activityRoutes,
    ],
  },
]);

export default router;