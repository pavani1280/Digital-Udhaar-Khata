import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, clearTransactionError } from "../store/transactionSlice.js";
import { fetchCustomers } from "../store/customerSlice.js";
import { X, Calendar, FileText, User } from "lucide-react";

const TransactionModal = ({ isOpen, onClose, selectedCustomerId }) => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const { settings } = useSelector((state) => state.settings);
  const { loading, error } = useSelector((state) => state.transactions);

  const [formData, setFormData] = useState({
    customerId: "",
    type: "credit", // credit = udhaar, payment = collection
    amount: "",
    description: "",
    date: new Date().toISOString().substring(0, 10)
  });

  const [formError, setFormError] = useState("");

  // Sync inputs on open
  useEffect(() => {
    setFormData({
      customerId: selectedCustomerId || "",
      type: "credit",
      amount: "",
      description: "",
      date: new Date().toISOString().substring(0, 10)
    });
    setFormError("");
    dispatch(clearTransactionError());

    // Fetch customers if not locked to one
    if (!selectedCustomerId && isOpen) {
      dispatch(fetchCustomers());
    }
  }, [selectedCustomerId, isOpen, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setType = (type) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { customerId, amount } = formData;
    if (!customerId) {
      setFormError("Please select a customer");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setFormError("Please enter a valid positive amount");
      return;
    }

    const result = await dispatch(addTransaction(formData));
    if (result.meta.requestStatus === "fulfilled") {
      onClose();
    }
  };

  const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-900">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Record New Transaction
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-4 bg-slate-50 dark:bg-slate-900 gap-2 border-b border-slate-100 dark:border-slate-900">
          <button
            type="button"
            onClick={() => setType("credit")}
            className={`rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
              formData.type === "credit"
                ? "bg-rose-500 text-white shadow-md shadow-rose-100 dark:shadow-none"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400"
            }`}
          >
            Give Credit (Udhaar)
          </button>
          <button
            type="button"
            onClick={() => setType("payment")}
            className={`rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
              formData.type === "payment"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 dark:shadow-none"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400"
            }`}
          >
            Receive Payment
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(formError || error) && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {formError || error}
            </div>
          )}

          {/* Customer Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Customer
            </label>
            <div className="relative">
              <User className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              {selectedCustomerId ? (
                <input
                  type="text"
                  readOnly
                  value={customers.find((c) => c._id === selectedCustomerId)?.name || "Selected Customer"}
                  className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 cursor-not-allowed outline-none"
                />
              ) : (
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="">Select a Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.phone}) - Bal: {currencySymbol}{c.balance}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Amount ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3.5 h-5 w-5 font-bold text-slate-400 dark:text-slate-500 flex items-center justify-center">
                {currencySymbol}
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="any"
                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Transaction Date
            </label>
            <div className="relative">
              <Calendar className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Remarks / Description
            </label>
            <div className="relative">
              <FileText className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Rice, Dal or Cash payment"
                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:bg-slate-400 dark:shadow-none ${
                formData.type === "credit" ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"
              }`}
            >
              {loading ? "Recording..." : `Record ${formData.type === "credit" ? "Credit" : "Payment"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
