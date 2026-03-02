// import { NavLink, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   BookOpen,
//   Layers,
//   Tag,
//   Mail,
//   UserPlus,
//   HelpCircle,
//   FileText,
//   Star,
//   GraduationCap,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";

// const navItems = [
//   { to: "/",            icon: LayoutDashboard, label: "Dashboard" },
//   { to: "category", icon: Layers,            label: "Category" },
//   { to: "/course",      icon: BookOpen,        label: "Courses" },
//   { to: "/modules",     icon: Layers,          label: "Modules" },
//   { to: "/topics",      icon: Tag,             label: "Topics" },
//   { to: "/contact",     icon: Mail,            label: "Contact" },
//   { to: "enroll",       icon: UserPlus,        label: "Enroll" },
//   { to: "faq",          icon: HelpCircle,      label: "FAQ" },
//   { to: "Blogs",        icon: FileText,        label: "Blogs" },
//   { to: "testimonials", icon: Star,            label: "Testimonials" },
// ];

// export default function Sidebar({ open, setOpen }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       // Close sidebar by default on mobile when component mounts
//       if (mobile && setOpen) {
//         setOpen(false);
//       }
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, [setOpen]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login", { replace: true });
//   };

//   const handleLinkClick = () => {
//     if (isMobile) setOpen(false);
//   };

//   const handleOverlayClick = () => setOpen(false);
//   const toggleSidebar = () => setOpen(!open);

//   const initials = user?.username
//     ? user.username.slice(0, 2).toUpperCase()
//     : "AD";

//   return (
//     <>
//       <style>{`
//         .sidebar-root {
//           font-family: 'Sora', 'Segoe UI', sans-serif;
//         }
//         .sidebar-nav-link {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           padding: 14px 20px;
//           border-radius: 10px;
//           transition: background 0.18s, color 0.18s;
//           color: #8a8fa8;
//           font-size: 15px;
//           font-weight: 500;
//           position: relative;
//           text-decoration: none;
//           cursor: pointer;
//           letter-spacing: 0.01em;
//         }
//         .sidebar-nav-link:hover {
//           background: rgba(255,255,255,0.06);
//           color: #e2e5f0;
//         }
//         .sidebar-nav-link.active {
//           background: rgba(255,255,255,0.07);
//           color: #ffffff;
//         }
//         .sidebar-nav-link.active::before {
//           content: '';
//           position: absolute;
//           left: 0;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 3px;
//           height: 20px;
//           background: #ffffff;
//           border-radius: 0 4px 4px 0;
//         }
//         .sidebar-nav-link .nav-icon {
//           opacity: 0.5;
//           transition: opacity 0.18s;
//           flex-shrink: 0;
//         }
//         .sidebar-nav-link:hover .nav-icon,
//         .sidebar-nav-link.active .nav-icon {
//           opacity: 1;
//         }
//         .sidebar-logout-btn {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 10px 16px;
//           border-radius: 10px;
//           width: 100%;
//           background: none;
//           border: none;
//           color: #8a8fa8;
//           font-size: 13.5px;
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.18s, color 0.18s;
//           letter-spacing: 0.01em;
//         }
//         .sidebar-logout-btn:hover {
//           background: rgba(239,68,68,0.1);
//           color: #f87171;
//         }
//         .sidebar-section-label {
//           font-size: 10px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.12em;
//           color: #4a4f6a;
//           padding: 8px 16px 6px;
//         }
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
//       `}</style>

//       {/* Mobile menu button */}
//       {isMobile && !open && (
//         <button
//           onClick={toggleSidebar}
//           style={{
//             position: "fixed",
//             top: 16,
//             left: 16,
//             zIndex: 50,
//             width: 44,
//             height: 44,
//             background: "#23263a",
//             borderRadius: 12,
//             border: "1px solid rgba(255,255,255,0.08)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
//             transition: "background 0.2s",
//           }}
//           aria-label="Open menu"
//         >
//           <Menu size={20} color="#e2e5f0" />
//         </button>
//       )}

//       {/* Overlay for mobile */}
//       {isMobile && open && (
//         <div
//           onClick={handleOverlayClick}
//           aria-hidden="true"
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(2px)",
//             zIndex: 40,
//           }}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className="sidebar-root"
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           background: "#16182a",
//           borderRight: "1px solid rgba(255,255,255,0.06)",
//           width: 280,
//           flexShrink: 0,
//           ...(isMobile
//             ? {
//                 position: "fixed",
//                 left: 0,
//                 top: 0,
//                 bottom: 0,
//                 zIndex: 50,
//                 boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
//                 transform: open ? "translateX(0)" : "translateX(-100%)",
//                 transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
//               }
//             : {
//                 position: "sticky",
//                 top: 0,
//                 height: "100vh",
//               }),
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "28px 20px 20px",
//             borderBottom: "1px solid rgba(255,255,255,0.06)",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//                 borderRadius: 10,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//                 boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
//               }}
//             >
//               <GraduationCap size={17} color="#fff" />
//             </div>
//             <span
//               style={{
//                 fontWeight: 800,
//                 fontSize: 20,
//                 color: "#ffffff",
//                 letterSpacing: "-0.02em",
//                 lineHeight: 1,
//               }}
//             >
//               Admin
//             </span>
//           </div>

//           {isMobile && open && (
//             <button
//               onClick={toggleSidebar}
//               style={{
//                 width: 30,
//                 height: 30,
//                 background: "rgba(255,255,255,0.06)",
//                 borderRadius: 8,
//                 border: "none",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 flexShrink: 0,
//               }}
//               aria-label="Close menu"
//             >
//               <X size={15} color="#8a8fa8" />
//             </button>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             overflowX: "hidden",
//             padding: "12px 10px",
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           <p className="sidebar-section-label">Main Menu</p>

//           {navItems.map(({ to, icon: Icon, label }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={to === "/"}
//               onClick={handleLinkClick}
//               className={({ isActive }) =>
//                 `sidebar-nav-link${isActive ? " active" : ""}`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <Icon
//                     size={17}
//                     className="nav-icon"
//                     color={isActive ? "#ffffff" : "#8a8fa8"}
//                   />
//                   <span>{label}</span>
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Divider */}
//         <div
//           style={{
//             margin: "0 16px",
//             height: 1,
//             background: "rgba(255,255,255,0.06)",
//           }}
//         />

//         {/* Profile & Logout */}
//         <div style={{ padding: "10px 10px 16px", display: "flex", flexDirection: "column", gap: 4 }}>

//           <button onClick={handleLogout} className="sidebar-logout-btn">
//             <LogOut size={17} style={{ flexShrink: 0, opacity: 0.6 }} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "category", icon: Layers, label: "Category" },
  { to: "/course", icon: BookOpen, label: "Courses" },
  { to: "/modules", icon: Layers, label: "Modules" },
  { to: "/topics", icon: Tag, label: "Topics" },
  { to: "/contact", icon: Mail, label: "Contact" },
  { to: "enroll", icon: UserPlus, label: "Enroll" },
  { to: "faq", icon: HelpCircle, label: "FAQ" },
  { to: "Blogs", icon: FileText, label: "Blogs" },
  { to: "testimonials", icon: Star, label: "Testimonials" },
];

function RippleNavLink({ to, icon: Icon, label, onLinkClick }) {
  const [ripples, setRipples] = useState([]);
  const linkRef = useRef(null);

  const handleClick = (e) => {
    const el = linkRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Get exact mouse/touch position relative to the element
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, cx, cy }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);

    if (onLinkClick) onLinkClick();
  };

  return (
    <NavLink
      ref={linkRef}
      to={to}
      end={to === "/"}
      onClick={handleClick}
      className={({ isActive }) =>
        `sidebar-nav-link${isActive ? " active" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {ripples.map((r) => (
            <span
              key={r.id}
              className="ripple-circle"
              style={{
                left: r.cx,
                top: r.cy,
              }}
            />
          ))}

          <Icon
            size={17}
            className="nav-icon"
            color={isActive ? "#ffffff" : "#8a8fa8"}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && setOpen) setOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };

  const handleOverlayClick = () => setOpen(false);
  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        .sidebar-root {
          font-family: 'Sora', 'Segoe UI', sans-serif;
        }

        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-radius: 10px;
          transition: background 0.18s, color 0.18s;
          color: #8a8fa8;
          font-size: 15px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          cursor: pointer;
          letter-spacing: 0.01em;
        }
        .sidebar-nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: #e2e5f0;
        }
        .sidebar-nav-link.active {
          background: rgba(255,255,255,0.07);
          color: #ffffff;
        }
        .sidebar-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #ffffff;
          border-radius: 0 4px 4px 0;
        }
        .sidebar-nav-link .nav-icon {
          opacity: 0.5;
          transition: opacity 0.18s;
          flex-shrink: 0;
        }
        .sidebar-nav-link:hover .nav-icon,
        .sidebar-nav-link.active .nav-icon {
          opacity: 1;
        }

        /* ── Ripple circle ── */
        .ripple-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          width: 6px;
          height: 6px;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-expand 0.7s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }

        @keyframes ripple-expand {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(55);
            opacity: 0;
          }
        }

        /* ── Misc ── */
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 10px;
          width: 100%;
          background: none;
          border: none;
          color: #8a8fa8;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          letter-spacing: 0.01em;
        }
        .sidebar-logout-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }
        .sidebar-section-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #4a4f6a;
          padding: 8px 16px 6px;
        }
      `}</style>

      {/* Mobile menu button */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 50,
            width: 44,
            height: 44,
            background: "#23263a",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          aria-label="Open menu"
        >
          <Menu size={20} color="#e2e5f0" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          onClick={handleOverlayClick}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="sidebar-root"
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#16182a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          width: 280,
          flexShrink: 0,
          ...(isMobile
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 50,
                boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
                transform: open ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
              }
            : {
                position: "sticky",
                top: 0,
                height: "100vh",
              }),
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
              }}
            >
              <GraduationCap size={17} color="#fff" />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Admin
            </span>
          </div>

          {isMobile && open && (
            <button
              onClick={toggleSidebar}
              style={{
                width: 30,
                height: 30,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="Close menu"
            >
              <X size={15} color="#8a8fa8" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <p className="sidebar-section-label">Main Menu</p>

          {navItems.map(({ to, icon, label }) => (
            <RippleNavLink
              key={to}
              to={to}
              icon={icon}
              label={label}
              onLinkClick={handleLinkClick}
            />
          ))}
        </nav>

        {/* Divider */}
        <div
          style={{
            margin: "0 16px",
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Logout */}
        <div
          style={{
            padding: "10px 10px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={17} style={{ flexShrink: 0, opacity: 0.6 }} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
