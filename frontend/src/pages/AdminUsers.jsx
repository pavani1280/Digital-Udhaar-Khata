import { useState, useEffect, useCallback } from "react";
import API from "../utils/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { Search, Store, User, Mail, Phone, CalendarDays, ShieldAlert } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/users", {
        params: { search, status: statusFilter || undefined }
      });
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load shopkeepers list");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    if (
      window.confirm(
        `Are you sure you want to ${nextStatus === "inactive" ? "deactivate" : "activate"} this shopkeeper account? ${
          nextStatus === "inactive" ? "Deactivated users cannot log in or manage ledgers." : ""
        }`
      )
    ) {
      try {
        await API.put(`/users/${id}/status`, { status: nextStatus });
        // Update local state directly to prevent full list loading spinners
        setUsers(
          users.map((u) => {
            if (u._id === id) {
              return { ...u, status: nextStatus };
            }
            return u;
          })
        );
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update account status");
      }
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Shopkeeper Accounts
        </h1>
        <p className="text-sm text-slate-500">
          Manage system users, activate or deactivate accounts, and monitor shop profiles
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or shop..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-10 text-sm bg-white text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Filters */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Users table */}
      {error ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-950 space-y-2">
          <ShieldAlert className="mx-auto h-8 w-8 text-rose-500" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{error}</p>
        </div>
      ) : loading && users.length === 0 ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-950">
          <User className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-300">No shopkeepers found</h3>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider dark:border-slate-900 dark:bg-slate-900/20">
                  <th className="px-6 py-4">Shop details</th>
                  <th className="px-6 py-4">Owner details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900 text-sm">
                {users.map((u) => {
                  const isActive = u.status === "active";
                  return (
                    <tr key={u._id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center space-x-2">
                          <Store className="h-4 w-4 text-indigo-500" />
                          <span>{u.shopName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-0.5 text-xs">
                        <p className="flex items-center space-x-1.5 text-slate-500">
                          <Mail className="h-3 w-3" />
                          <span>{u.email}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-slate-500">
                          <Phone className="h-3 w-3" />
                          <span>{u.phone}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <CalendarDays className="h-4.5 w-4.5" />
                          <span>
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition duration-200 ${
                            isActive
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/25 dark:text-rose-400"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/25 dark:text-emerald-400"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
