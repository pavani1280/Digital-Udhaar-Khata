import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, fetchProfile, clearError } from "../store/authSlice.js";
import {
  User,
  Phone,
  Store,
  Lock,
  KeyRound,
  CheckCircle,
  Mail,
  ShieldCheck,
  RotateCcw,
  Save
} from "lucide-react";

const getProfileFormData = (user) => ({
  name: user?.name || "",
  shopName: user?.shopName || "",
  phone: user?.phone || "",
  password: "",
  confirmPassword: ""
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(getProfileFormData(user));

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    setFormData(getProfileFormData(user));
    setSuccess(false);
    setFormError("");
    dispatch(clearError());
  }, [user, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData(getProfileFormData(user));
    setFormError("");
    setSuccess(false);
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess(false);
    dispatch(clearError());

    const name = formData.name.trim();
    const shopName = formData.shopName.trim();
    const phone = formData.phone.trim();
    const { password, confirmPassword } = formData;

    if (!name || !shopName || !phone) {
      setFormError("Name, Shop Name, and Phone number are required");
      return;
    }

    if (!/^[0-9+\-\s()]{8,15}$/.test(phone)) {
      setFormError("Please enter a valid phone number");
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFormError("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match");
        return;
      }
    }

    const updatePayload = { name, shopName, phone };
    if (password) {
      updatePayload.password = password;
    }

    const result = await dispatch(updateProfile(updatePayload));
    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const hasProfileChanges =
    formData.name !== (user?.name || "") ||
    formData.shopName !== (user?.shopName || "") ||
    formData.phone !== (user?.phone || "") ||
    !!formData.password ||
    !!formData.confirmPassword;

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500">
            Manage shop details, contact information, and account password
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>{user?.status || "active"} account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-750 dark:bg-indigo-950 dark:text-indigo-300">
                {initials}
              </div>
              <h2 className="mt-4 text-lg font-extrabold text-slate-800 dark:text-slate-100">
                {user?.name || "Shopkeeper"}
              </h2>
              <p className="text-sm font-medium text-slate-500">{user?.shopName || "Your shop"}</p>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-900">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                  <p className="truncate font-semibold text-slate-700 dark:text-slate-300">{user?.email || "Not available"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</p>
                  <p className="font-semibold capitalize text-slate-700 dark:text-slate-300">{user?.role || "shopkeeper"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            {(formError || error) && (
              <div className="rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                {formError || error}
              </div>
            )}

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Shopkeeper Details</h3>
                <p className="text-xs text-slate-400">This information appears in reminder messages and account records.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Shop Name
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Sharma Kirana"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-slate-100 pt-6 dark:border-slate-900">
              <h3 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                <KeyRound className="h-4 w-4 text-indigo-500" />
                <span>Change Password</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[10px] font-medium text-slate-400">
                Use at least 6 characters. Password changes sign a fresh token automatically.
              </p>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-900 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || !hasProfileChanges}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 shadow-sm transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                disabled={loading || !hasProfileChanges}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:bg-indigo-400 dark:shadow-none transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
