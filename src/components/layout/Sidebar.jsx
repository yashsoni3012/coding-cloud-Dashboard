import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShoppingCart,
  Settings,
  ChevronLeft,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/course", icon: LayoutDashboard, label: "Courses" },
  { to: "/modules", icon: LayoutDashboard, label: "Modules" },
  { to: "/topics", icon: LayoutDashboard, label: "Topics" },
  // { to: '/users',     icon: Users,           label: 'Users' },
  // { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  // { to: '/orders',    icon: ShoppingCart,    label: 'Orders' },
  // { to: '/settings',  icon: Settings,        label: 'Settings' },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleOverlayClick = () => {
    setOpen(false);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  // For desktop hover expansion
  const isExpanded = open || (isHovered && !isMobile && !open);

  return (
    <>
      {/* Mobile menu button - visible when sidebar is closed on mobile */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-white" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          relative flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out shrink-0
          ${
            isMobile
              ? `fixed left-0 top-0 bottom-0 z-50 shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`
              : "sticky top-0 h-screen"
          }
          ${!isMobile && (open ? "w-64" : "w-20")}
          ${isMobile ? "w-72" : ""}
        `}
        onMouseEnter={() => !isMobile && !open && setIsHovered(true)}
        onMouseLeave={() => !isMobile && !open && setIsHovered(false)}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <Zap size={20} className="text-white" />
            </div>
            {(isExpanded || isMobile) && (
              <span className="font-bold text-gray-900 text-xl tracking-tight truncate">
                AdminPanel
              </span>
            )}
          </div>

          {/* Close button - visible on mobile when sidebar is open */}
          {isMobile && open && (
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {isExpanded && !isMobile && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pb-2">
              Main Menu
            </p>
          )}
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={handleLinkClick}
              className={({ isActive }) => {
                const baseClasses =
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative";
                const activeClasses = isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
                const collapsedClasses =
                  !isExpanded && !isMobile ? "justify-center" : "";

                return `${baseClasses} ${activeClasses} ${collapsedClasses}`;
              }}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-transform group-hover:scale-110 ${isExpanded || isMobile ? "" : "mx-auto"}`}
              />
              {(isExpanded || isMobile) && (
                <span className="text-sm font-medium">{label}</span>
              )}

              {/* Tooltip for collapsed state - desktop only */}
              {!isExpanded && !isMobile && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Profile */}
          <div
            className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
            ${isExpanded || isMobile ? "bg-gray-50" : "justify-center hover:bg-gray-100"}
          `}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md shadow-indigo-600/20">
              {initials}
            </div>
            {(isExpanded || isMobile) && (
              <div className="truncate flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Online
                </p>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              transition-all duration-200 group relative
              text-red-600 hover:bg-red-50 hover:text-red-700
              ${!isExpanded && !isMobile ? "justify-center" : ""}
            `}
            title={isExpanded || isMobile ? "" : "Logout"}
          >
            <LogOut
              size={20}
              className="shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-x-0.5"
            />
            {(isExpanded || isMobile) && (
              <span className="text-sm font-medium">Logout</span>
            )}

            {/* Tooltip for collapsed state - desktop only */}
            {!isExpanded && !isMobile && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Toggle button for desktop - left side circular button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`
              absolute -right-3 top-20 w-7 h-7 bg-white border-2 border-indigo-200 
              rounded-full flex items-center justify-center hover:bg-indigo-50 
              transition-all shadow-md z-10 hover:scale-110 hover:border-indigo-300
              ${open ? "rotate-0" : "rotate-180"}
            `}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              size={14}
              className="text-indigo-600 transition-transform duration-300"
            />
          </button>
        )}
      </aside>

      {/* Mobile Toggle Button when sidebar is open - alternative position */}
      {isMobile && open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-[18rem] z-50 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
          aria-label="Close menu"
        >
          <X size={16} className="text-gray-600" />
        </button>
      )}
    </>
  );
}
