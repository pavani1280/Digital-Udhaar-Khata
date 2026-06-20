import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, fetchProfile, clearError } from "../store/authSlice.js";
import { fetchCustomers } from "../store/customerSlice.js";
import { fetchSettings } from "../store/settingsSlice.js";
import { ApplicationSettingsForm } from "./Settings.jsx";
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
  Save,
  TrendingUp,
  TrendingDown,
  Scale,
  X,
  Settings as SettingsIcon
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
  const { customers } = useSelector((state) => state.customers);
  const { settings } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState(getProfileFormData(user));

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showOutstandingDetails, setShowOutstandingDetails] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showApplicationSettings, setShowApplicationSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchCustomers());
    dispatch(fetchSettings());
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

  const currencySymbol = settings.currency === "INR" ? "â‚¹" : settings.currency === "USD" ? "$" : settings.currency;
  const outstandingCredit = customers
    .filter((customer) => Number(customer.balance) > 0)
    .reduce((sum, customer) => sum + Number(customer.balance), 0);
  const outstandingDebt = customers
    .filter((customer) => Number(customer.balance) < 0)
    .reduce((sum, customer) => sum + Math.abs(Number(customer.balance)), 0);
  const netOutstanding = outstandingCredit - outstandingDebt;
  const customersWithBalance = customers.filter((customer) => Number(customer.balance) !== 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-sm text-slate-500">
            Manage your account, outstanding balances, password, and application settings
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-950/40 dark:bg-emerald-950/20 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>{user?.status || "active"} account</span>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-indigo-100 text-4xl font-black text-indigo-700 shadow-sm dark:bg-indigo-950 dark:text-indigo-300">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                {user?.name || "Shopkeeper"}
              </h2>
              <p className="mt-1 text-base font-semibold text-slate-500">{user?.shopName || "Your shop"}</p>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:justify-start">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{user?.email || "Not available"}</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300 sm:justify-start">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <span className="capitalize">{user?.role || "shopkeeper"} account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-80">
            <button
              type="button"
              onClick={() => setShowProfileDetails(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <span>See Details</span>
            </button>
            <button
              type="button"
              onClick={() => setShowApplicationSettings((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Application Settings</span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-md dark:border-rose-950/30 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Credit</span>
            <TrendingUp className="h-5 w-5 text-rose-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-rose-500">
            {currencySymbol}{outstandingCredit.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-slate-400">Customers owe you</p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-md dark:border-emerald-950/30 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Debt</span>
            <TrendingDown className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-500">
            {currencySymbol}{outstandingDebt.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-slate-400">You owe customers</p>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-md dark:border-indigo-950/30 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Outstanding</span>
            <Scale className="h-5 w-5 text-indigo-500" />
          </div>
          <p className={`mt-3 text-2xl font-black ${netOutstanding >= 0 ? "text-indigo-600" : "text-emerald-500"}`}>
            {currencySymbol}{Math.abs(netOutstanding).toLocaleString("en-IN")}
          </p>
          <button
            type="button"
            onClick={() => setShowOutstandingDetails(true)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>See details</span>
          </button>
        </div>
      </section>

      {showOutstandingDetails && (
        <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Outstanding Details</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-900">
                  <th className="py-3">Customer</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {customersWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-sm text-slate-400">No outstanding balances.</td>
                  </tr>
                ) : (
                  customersWithBalance.map((customer) => {
                    const balance = Number(customer.balance);
                    return (
                      <tr key={customer._id} className="text-slate-600 dark:text-slate-300">
                        <td className="py-3 font-semibold">{customer.name}</td>
                        <td className="py-3 text-xs text-slate-400">{customer.phone}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${balance > 0 ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"}`}>
                            {balance > 0 ? "Credit" : "Debt"}
                          </span>
                        </td>
                        <td className={`py-3 text-right font-black ${balance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                          {currencySymbol}{Math.abs(balance).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showProfileDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200/60 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-900 dark:bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Shopkeeper Details</h3>
                <p className="text-xs text-slate-400">Update your name, shop details, contact information, and password.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileDetails(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                type="button"
                onClick={() => setShowProfileDetails(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 shadow-sm transition-all"
              >
                Close
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
      )}

      {showApplicationSettings && (
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Application Settings
          </h2>
          <p className="text-sm text-slate-500">
            Configure currency, due periods, and reminder message templates from your profile.
          </p>
        </div>
        <ApplicationSettingsForm embedded />
      </section>
      )}
    </div>
  );
};

export default Profile;
