import { useState, useContext } from "react";
import { Sidebar } from "../Components/Sidebar";
import { Navbar } from "../Components/Navbar";
import { menus } from "../Components/Menu";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "../Components/Style/Dashboard.css";

export const DashboardLayout = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { user, isLoading } = auth;

  if (isLoading) return null;

  if (!user?.role) return null;

  const menu = menus[user.role];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen relative app">

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          menu={menu}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />

        {/* Right */}
        <div className="flex flex-col flex-1">
          <Navbar
            setSidebarOpen={setSidebarOpen}
            dark={dark}
            setDark={setDark}
            showNotif={showNotif}
            setShowNotif={setShowNotif}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
          />

          {/* Main */}
          <div className="flex-1 overflow-y-auto main-div">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};