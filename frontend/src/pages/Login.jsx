import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/authSlice.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [formError, setFormError] = useState("");
  const redirectedError = location.state?.error || "";

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { email, password } = formData;
    if (!email || !password) {
      setFormError("Please enter email and password");
      return;
    }

    dispatch(loginUser(formData));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Brand */}
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-2xl shadow-sm">
            ₹
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
            Log in to manage your digital ledgers securely
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {(formError || error || redirectedError) && (
            <div className="rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {formError || error || redirectedError}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. shopkeeper@example.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 dark:shadow-none"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-200 group-hover:text-white" />
              </span>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="inline-flex items-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <span>Register here</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
