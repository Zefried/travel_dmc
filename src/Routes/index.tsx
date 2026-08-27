import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../Layouts/DashboardLayout";
import { Login } from "../Pages/Auth/Login";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Unauthorized } from "../Pages/Auth/Unauthorized";
import { DashboardHome } from "../Pages/Panels/DashboardHome";
import { departmentRoutes } from "./Department/route";
import { adminRoutes } from "./Admin/route";
import Home from "../Pages/Website/Home/Home";
import PackageBuilderPage from "../Pages/Website/PackageBuilder/PackageBuilderPage";

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
    element: <Home />,
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
      <ProtectedRoute allowedRoles={["admin", "subadmin", "department"]}>
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
      ...departmentRoutes,
    ],
  },
]);

export default router;