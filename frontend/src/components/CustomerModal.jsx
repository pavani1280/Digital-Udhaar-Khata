import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, updateCustomer, clearCustomerError } from "../store/customerSlice.js";
import { X, User, Phone, MapPin } from "lucide-react";

const CustomerModal = ({ isOpen, onClose, customerToEdit }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [formError, setFormError] = useState("");

  // Load customer data when editing
  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        name: customerToEdit.name || "",
        phone: customerToEdit.phone || "",
        address: customerToEdit.address || ""
      });
    } else {
      setFormData({ name: "", phone: "", address: "" });
    }
    setFormError("");
    dispatch(clearCustomerError());
  }, [customerToEdit, isOpen, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { name, phone, address } = formData;
    if (!name || !phone || !address) {
      setFormError("All fields are required");
      return;
    }

    let result;
    if (customerToEdit) {
      result = await dispatch(updateCustomer({ id: customerToEdit._id, customerData: formData }));
    } else {
      result = await dispatch(addCustomer(formData));
    }

    if (result.meta.requestStatus === "fulfilled") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-900">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {customerToEdit ? "Edit Customer Details" : "Add New Customer"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(formError || error) && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {formError || error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Customer Name
            </label>
            <div className="relative">
              <User className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-11 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute top-3.5 left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
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
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:bg-indigo-400 dark:shadow-none"
            >
              {loading ? "Saving..." : customerToEdit ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
