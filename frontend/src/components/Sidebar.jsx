import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import {
  LayoutDashboard,
  Users,
  User,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
      isCollapsed ? "px-4 lg:px-0 lg:justify-center space-x-3 lg:space-x-0" : "px-4 space-x-3"
    } ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
    }`;

  const shopkeeperLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/profile", label: "Profile Settings", icon: User },
    { to: "/settings", label: "Application Settings", icon: SettingsIcon }
  ];

  const adminLinks = [
    { to: "/admin", label: "Platform Stats", icon: ShieldCheck, end: true },
    { to: "/admin/users", label: "Manage Users", icon: UserCheck }
  ];

  const links = user.role === "admin" ? adminLinks : shopkeeperLinks;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 border-r border-slate-200 bg-white pt-16 transition-[width,transform] duration-300 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0"}`}
      >
        {/* Toggle trigger on Mobile */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Toggle sidebar"
          >
            <span className="flex h-4 w-4 flex-col justify-between">
              <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
              <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
              <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
            </span>
          </button>
        </div>

        {/* User Info Card */}
        <div className={`border-b border-slate-100 dark:border-slate-900 transition-all duration-300 ${isCollapsed ? "lg:px-4 lg:py-5" : "px-6 py-5"}`}>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`flex w-full items-center text-left transition hover:bg-slate-50 dark:hover:bg-slate-900 ${
              isCollapsed ? "lg:justify-center lg:space-x-0" : "space-x-3"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase text-lg shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className={`transition-opacity duration-300 ${isCollapsed ? "lg:hidden" : "block"}`}>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                {user.shopName}
              </h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                {user.role} Account
              </p>
            </div>
          </button>
        </div>

        {/* Navigation List */}
        <div className={`flex flex-col justify-between h-[calc(100vh-140px)] py-6 transition-all duration-300 ${isCollapsed ? "px-2 lg:px-3" : "px-4"}`}>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => isOpen && toggleSidebar()}
                  className={navLinkClass}
                  title={isCollapsed ? link.label : ""}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={isCollapsed ? "lg:hidden" : "block"}>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Actions at bottom (Logout and Collapse toggle) */}
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              title={isCollapsed ? "Log Out" : ""}
              className={`flex w-full items-center rounded-xl py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 ${
                isCollapsed ? "px-4 lg:px-0 lg:justify-center space-x-3 lg:space-x-0" : "px-4 space-x-3"
              }`}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={isCollapsed ? "lg:hidden" : "block"}>Log Out</span>
            </button>

            {/* Collapse Toggle Button (Desktop only) */}
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className={`hidden lg:flex w-full items-center rounded-xl py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 ${
                isCollapsed ? "justify-center" : "px-4 space-x-3"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 shrink-0" />
                  <span className="truncate">Collapse Sidebar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
