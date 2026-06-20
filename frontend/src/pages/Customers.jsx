import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, deleteCustomer } from "../store/customerSlice.js";
import { fetchSettings } from "../store/settingsSlice.js";
import {
  Search,
  Plus,
  ArrowUpDown,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  CircleAlert,
  CalendarClock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomerModal from "../components/CustomerModal.jsx";
import TransactionModal from "../components/TransactionModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customers, loading } = useSelector((state) => state.customers);
  const { settings } = useSelector((state) => state.settings);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers({ search, sortBy }));
    dispatch(fetchSettings());
  }, [dispatch, search, sortBy]);

  const handleEditCustomer = (e, customer) => {
    e.stopPropagation(); // prevent navigating to details
    setCustomerToEdit(customer);
    setIsCustModalOpen(true);
  };

  const handleOpenAddCustomer = () => {
    setCustomerToEdit(null);
    setIsCustModalOpen(true);
  };

  const handleDeleteCustomer = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this customer? This will also delete all their transaction history permanently.")) {
      dispatch(deleteCustomer(id));
    }
  };

  const handleOpenTransModal = (e, customerId) => {
    e.stopPropagation();
    setSelectedCustomerId(customerId);
    setIsTransModalOpen(true);
  };

  const getReminderStatus = (reminderDate) => {
    if (!reminderDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reminder = new Date(reminderDate);
    reminder.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((reminder - today) / 86400000);

    if (dayDiff < 0) {
      return {
        label: `Overdue ${Math.abs(dayDiff)}d`,
        className: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
      };
    }

    if (dayDiff === 0) {
      return {
        label: "Reminder today",
        className: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
      };
    }

    return {
      label: `Reminder in ${dayDiff}d`,
      className: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"
    };
  };

  const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Customers Ledger
          </h1>
          <p className="text-sm text-slate-500">
            Manage customer profiles and record individual ledger logs
          </p>
        </div>
        <button
          onClick={handleOpenAddCustomer}
          className="flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 dark:shadow-none transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search and Filter Panel */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone number..."
            className="w-full rounded-2xl border border-slate-200 py-2.5 pr-4 pl-10 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 shadow-sm"
          />
        </div>

        {/* Sort options */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 shadow-sm"
          >
            <option value="name">Alphabetical (A-Z)</option>
            <option value="balance-desc">Owes Most (High Bal)</option>
            <option value="balance-asc">Paid Surplus (Low Bal)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Customer Registry List */}
      {loading && customers.length === 0 ? (
        <LoadingSpinner />
      ) : customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-250 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-950 shadow-md">
          <CircleAlert className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-750" />
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-300">
            No customers found
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {search ? "No matches for your query. Try another search." : "Get started by adding your first customer."}
          </p>
          {!search && (
            <button
              onClick={handleOpenAddCustomer}
              className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Customer</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((cust) => {
            const owesMoney = cust.balance > 0;
            const hasSurplus = cust.balance < 0;
            const reminderStatus = getReminderStatus(cust.reminderDate);

            return (
              <div
                key={cust._id}
                onClick={() => navigate(`/customers/${cust._id}`)}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-slate-300 cursor-pointer dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
              >
                {/* Details top */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cust.name}
                      </h3>
                      <div className="mt-2 space-y-1 text-xs text-slate-400 dark:text-slate-500">
                        <p className="flex items-center space-x-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{cust.phone}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{cust.address}</span>
                        </p>
                        {reminderStatus && (
                          <p className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${reminderStatus.className}`}>
                            <CalendarClock className="h-3 w-3" />
                            <span>{reminderStatus.label}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </p>
                      <p
                        className={`mt-1 text-base font-extrabold ${
                          owesMoney
                            ? "text-rose-500"
                            : hasSurplus
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }`}
                      >
                        {owesMoney ? "Owes " : hasSurplus ? "Surplus " : "Settled"}
                        {currencySymbol}
                        {Math.abs(cust.balance).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ledger Quick Entries / CRUD bottom */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleOpenTransModal(e, cust._id)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-slate-55 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                      title="Add Ledger Entry"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Ledger Entry</span>
                    </button>
                  </div>

                  <div className="flex space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditCustomer(e, cust)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-350"
                      title="Edit Customer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCustomer(e, cust._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      title="Delete Customer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CustomerModal
        isOpen={isCustModalOpen}
        onClose={() => setIsCustModalOpen(false)}
        customerToEdit={customerToEdit}
      />

      <TransactionModal
        isOpen={isTransModalOpen}
        onClose={() => setIsTransModalOpen(false)}
        selectedCustomerId={selectedCustomerId}
      />
    </div>
  );
};

export default Customers;
