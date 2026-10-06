import { Bell, Moon, Sun, PanelLeft, User, LogOut } from "lucide-react";
import "./Style/Navbar.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../api/axios";

type NavbarProps = {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  setShowNotif: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  showNotif: boolean;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navbar = ({
  setSidebarOpen,
  dark,
  setDark,
  showNotif,
  setShowNotif,
  showProfile,
  setShowProfile,
}: NavbarProps) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/locations": "Location",
    "/dashboard/department": "Home",
    "/dashboard/add-agent": "Add Agent",
    "/dashboard/agent-profile": "Agent Profile",
    "/dashboard/total-agents": "All Agents",
    "/dashboard/total-workers": "All Workers",
    "/dashboard/total-transactions": "All Transactions",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await Axios.get("/notifications");
      if (res.data.status) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id: string, link: string) => {
    try {
      await Axios.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setShowNotif(false);
      navigate(link);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Axios.patch(`/notifications/read-all`);
      setNotifications([]);
      setUnreadCount(0);
      setShowNotif(false);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <div
      className={`navbar ${dark ? "dark" : ""}`}
      style={{ color: dark ? "white" : "black" }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <PanelLeft
          size={18}
          className="cursor-pointer"
          onClick={() => setSidebarOpen((prev) => !prev)}
        />
        <span className="nav-title">{pageTitle}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 extra-margin">
        <button
          onClick={() => setDark((prev) => !prev)}
          className="icon-btn"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div className="relative">
          <div className="relative">
            <Bell
              size={18}
              className="icon-btn-bell"
              onClick={() => setShowNotif((prev) => !prev)}
            />
            {unreadCount > 0 && (
              <span className="notif-badge">
                {unreadCount}
              </span>
            )}
          </div>

          {showNotif && (
            <div className="notif-box">
              <div className="notif-header">
                <h3 className="notif-title">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={markAllAsRead} className="notif-mark-read">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id, notif.data.link)}
                      className="notif-item"
                    >
                      <p className="notif-message">{notif.data.message}</p>
                      <span className="notif-time">
                        {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* AVATAR */}
        <div
          className="avatar cursor-pointer"
          onClick={() => setShowProfile((prev) => !prev)}
        />

        {/* PROFILE DROPDOWN */}
        {showProfile && (
          <div className="profile-box">
            <div className="profile-item">
              <User size={16} />
              <span>Profile</span>
            </div>

            <div
              className="profile-item"
              onClick={() => {
                auth?.logout();
                navigate("/login");
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};