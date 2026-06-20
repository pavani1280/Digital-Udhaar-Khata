import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import { fetchNotifications, markNotificationAsRead } from "../store/notificationSlice.js";
import { Sun, Moon, Bell, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
    (localStorage.getItem("theme") === null && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Sync Dark/Light theme class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Periodically fetch notifications for shopkeepers
  useEffect(() => {
    if (user && user.role === "shopkeeper") {
      dispatch(fetchNotifications());
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000); // fetch every 30s
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleProfileClick = () => {
    if (user?.role === "shopkeeper") {
      setShowProfileMenu(false);
      navigate("/profile");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand and Sidebar trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 focus:outline-none shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Toggle sidebar"
            >
              <span className="flex h-4 w-4 flex-col justify-between">
                <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
                <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
                <span className="block h-0.5 w-full rounded-full bg-slate-500 dark:bg-slate-400" />
              </span>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
                MyKhata
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Toggle Mode"
              >
                {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications Dropdown (Shopkeeper only) */}
              {user.role === "shopkeeper" && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                      <div className="border-b border-slate-100 px-4 py-2 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300 flex justify-between items-center">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No notifications available
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleNotificationClick(n._id)}
                              className={`flex flex-col rounded-lg p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer ${
                                !n.isRead ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                              }`}
                            >
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                {n.message}
                              </span>
                              <span className="mt-1 text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={handleProfileClick}
                      className="w-full rounded-t-xl px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.shopName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </button>
                    {user.role === "shopkeeper" && (
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
