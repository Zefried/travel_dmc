import { ChevronDown } from "lucide-react";
import "./Style/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

type MenuItem = {
  name: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    name: string;
    path?: string;
    icon?: React.ElementType;
  }[];
};

type SidebarProps = {
  menu: MenuItem[];
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
};

export const Sidebar = ({
  menu,
  sidebarOpen,
  setSidebarOpen,
  openMenu,
  setOpenMenu,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = window.innerWidth < 768;

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Logo section */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img
            src="https://images.openai.com/static-rsc-4/bHfA1xSaSFi-hs0IdLhAHgtWkdUM6W9tWZQ5DczOyPH4mEXq9L7uqg-YA98dO04MKtL_HGnqJPSgQrL4M6jjHaDkhhksZaRlguTFq07Zf8R8MfY98V039EqnbF8RfBwy147y5FFxPuIg4x3aN4FA-oqUt3xLn57ZzOXfwhTP3RnqRV_qqLszuXp4I5gZeEI5?purpose=fullsize"
            alt="Fixo Logo"
          />
        </div>

        {sidebarOpen && (
          <span className="brand-name">CCTV Dashboard</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="nav">
        {menu.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenu === item.name;

          const isActive = item.path
            ? location.pathname === item.path
            : item.children?.some(
                (sub) => location.pathname === sub.path
              );

          return (
            <div key={item.name}>
              {/* Menu Item */}
              <div
                onClick={() => {
                  if (item.children) {
                    setOpenMenu(isOpen ? null : item.name);
                  } else if (item.path) {
                    navigate(item.path);

                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }
                }}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <div className="menu-left">
                  <Icon size={18} />
                  {sidebarOpen && <span>{item.name}</span>}
                </div>

                {item.children && sidebarOpen && (
                  <ChevronDown
                    size={16}
                    className={`chevron ${isOpen ? "rotate" : ""}`}
                  />
                )}
              </div>

              {/* Submenu */}
              {item.children && isOpen && sidebarOpen && (
                <div className="submenu">
                  {item.children.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive =
                      location.pathname === sub.path;

                    return (
                      <div
                        key={sub.name}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (sub.path) {
                            navigate(sub.path);

                            if (isMobile) {
                              setSidebarOpen(false);
                            }
                          }
                        }}
                        className={`submenu-item ${
                          isSubActive ? "active" : ""
                        }`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {SubIcon && <SubIcon size={15} />}
                        <span>{sub.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};