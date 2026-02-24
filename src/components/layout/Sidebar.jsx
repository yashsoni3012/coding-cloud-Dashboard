import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Tag,
  Mail,
  UserPlus,
  HelpCircle,
  FileText,
  Star,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/",            icon: LayoutDashboard, label: "Dashboard" },
  { to: "/course",      icon: BookOpen,        label: "Courses" },
  { to: "/modules",     icon: Layers,          label: "Modules" },
  { to: "/topics",      icon: Tag,             label: "Topics" },
  { to: "/contact",     icon: Mail,            label: "Contact" },
  { to: "enroll",       icon: UserPlus,        label: "Enroll" },
  { to: "faq",          icon: HelpCircle,      label: "FAQ" },
  { to: "Blogs",        icon: FileText,        label: "Blogs" },
  { to: "testimonials", icon: Star,            label: "Testimonials" },
];

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };

  const handleOverlayClick = () => setOpen(false);
  const toggleSidebar = () => setOpen(!open);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 w-11 h-11 bg-sky-600 rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center hover:bg-sky-700 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-white" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-white border-r border-slate-200/80
          shadow-[4px_0_24px_rgba(0,0,0,0.06)]
          shrink-0 w-64
          ${
            isMobile
              ? `fixed left-0 top-0 bottom-0 z-50 shadow-2xl transform transition-transform duration-300 ${
                  open ? "translate-x-0" : "-translate-x-full"
                }`
              : "sticky top-0 h-screen"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-slate-800 text-[15px] tracking-tight truncate leading-tight">
                AdminPanel
              </span>
              <span className="block text-[10px] font-semibold text-sky-500 tracking-widest uppercase leading-tight mt-0.5">
                Dashboard
              </span>
            </div>
          </div>

          {isMobile && open && (
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors duration-150 shrink-0"
              aria-label="Close menu"
            >
              <X size={16} className="text-slate-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] px-3 pb-2 pt-1">
            Main Menu
          </p>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sky-500 rounded-r-full" />
                  )}
                  <Icon
                    size={18}
                    className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="text-[13.5px] font-medium truncate">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* Profile & Logout */}
        <div className="p-3 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm shadow-sky-500/20 tracking-wide">
              {initials}
            </div>
            <div className="truncate flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-700 truncate leading-tight">
                {user?.username || "Admin User"}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Online
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 group text-rose-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut
              size={18}
              className="shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:-translate-x-0.5"
            />
            <span className="text-[13.5px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      
    </>
  );
}