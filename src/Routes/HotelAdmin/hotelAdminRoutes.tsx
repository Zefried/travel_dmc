import { ProtectedRoute } from "../ProtectedRoutes";
import HotelMarkBusy from "../../Pages/HotelAdmin/MarkBusy/HotelMarkBusy";
import HotelViewBusy from "../../Pages/HotelAdmin/ViewBusy/HotelViewBusy";

export const hotelAdminRoutes = [
  {
    path: "hotel-admin/mark-busy",
    element: (
      <ProtectedRoute allowedRoles={["hotel_admin"]}>
        <HotelMarkBusy />
      </ProtectedRoute>
    ),
  },
  {
    path: "hotel-admin/view-busy",
    element: (
      <ProtectedRoute allowedRoles={["hotel_admin"]}>
        <HotelViewBusy />
      </ProtectedRoute>
    ),
  },
];
