import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettings, clearSettingsError } from "../store/settingsSlice.js";
import { Coins, CalendarDays, MessageSquareCode, CheckCircle, Info } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export const ApplicationSettingsForm = ({ embedded = false }) => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    currency: "INR",
    duePeriodDays: 30,
    whatsappReminderTemplate: ""
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || "INR",
        duePeriodDays: settings.duePeriodDays || 30,
        whatsappReminderTemplate: settings.whatsappReminderTemplate || ""
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "duePeriodDays" ? Number(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    dispatch(clearSettingsError());

    const result = await dispatch(updateSettings(formData));
    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading && !settings) {
    return <LoadingSpinner />;
  }

  const content = (
    <>
      {!embedded && (
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Application Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure ledger parameters, currency settings, and custom SMS/WhatsApp notifications
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Currency */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <Coins className="h-4 w-4" />
              <span>Workspace Currency</span>
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
            >
              <option value="INR">INR (₹) Indian Rupee</option>
              <option value="USD">USD ($) US Dollar</option>
              <option value="EUR">EUR (€) Euro</option>
              <option value="GBP">GBP (£) British Pound</option>
            </select>
          </div>

          {/* Payment Terms */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Payment Grace Period (Days)</span>
            </label>
            <input
              type="number"
              name="duePeriodDays"
              value={formData.duePeriodDays}
              onChange={handleChange}
              placeholder="30"
              min="1"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
            />
            <p className="text-[10px] text-slate-400">
              Credits outstanding longer than this duration will trigger payment reminders
            </p>
          </div>

          {/* Notification Message Template */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <MessageSquareCode className="h-4 w-4" />
              <span>WhatsApp Reminder Template</span>
            </label>
            <textarea
              name="whatsappReminderTemplate"
              value={formData.whatsappReminderTemplate}
              onChange={handleChange}
              rows={4}
              placeholder="e.g. Hello {customerName}, you have a due balance..."
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-sans shadow-sm"
            />

            {/* Variable guide list */}
            <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                <Info className="h-3.5 w-3.5" />
                <span>Available Template Variables</span>
              </span>
              <ul className="text-[10.5px] font-medium text-slate-500 space-y-1 list-disc pl-4 font-mono">
                <li>
                  <span className="text-indigo-600 dark:text-indigo-400">{`{customerName}`}</span> - Replaced with the customer's full name.
                </li>
                <li>
                  <span className="text-indigo-600 dark:text-indigo-400">{`{balance}`}</span> - Replaced with the outstanding balance.
                </li>
                <li>
                  <span className="text-indigo-600 dark:text-indigo-400">{`{currency}`}</span> - Replaced with your currency symbol (e.g. ₹ or $).
                </li>
                <li>
                  <span className="text-indigo-600 dark:text-indigo-400">{`{shopName}`}</span> - Replaced with your Shop Name.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 disabled:bg-indigo-400 dark:shadow-none transition-all duration-200"
            >
              {loading ? "Saving settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {content}
    </div>
  );
};

const Settings = () => <ApplicationSettingsForm />;

export default Settings;
