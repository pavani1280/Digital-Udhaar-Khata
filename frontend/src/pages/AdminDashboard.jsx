import { useState, useEffect } from "react";
import API from "../utils/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  ShieldAlert,
  Users,
  Store,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  UserX,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/stats");
      setStats(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <ShieldAlert className="mx-auto h-12 w-12 text-rose-500" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Error Loading Statistics</h3>
        <p className="text-sm text-slate-500">{error}</p>
        <button onClick={fetchStats} className="bg-indigo-600 px-4 py-2 rounded-xl text-white font-semibold text-sm hover:bg-indigo-700">
          Retry
        </button>
      </div>
    );
  }

  const currencySymbol = "₹";

  const kpis = [
    {
      label: "Total Shopkeepers",
      value: stats?.shopkeepers?.total || 0,
      subValue: `${stats?.shopkeepers?.active || 0} Active | ${stats?.shopkeepers?.inactive || 0} Deactivated`,
      icon: Store,
      color: "indigo"
    },
    {
      label: "Customer Profiles",
      value: stats?.totalCustomers || 0,
      subValue: "Platform-wide customer base",
      icon: Users,
      color: "amber"
    },
    {
      label: "Platform Credit Given",
      value: `${currencySymbol}${stats?.transactions?.creditGiven?.toLocaleString("en-IN") || 0}`,
      subValue: `${stats?.transactions?.creditCount || 0} Ledger entries`,
      icon: ArrowUpRight,
      color: "rose"
    },
    {
      label: "Total Collected",
      value: `${currencySymbol}${stats?.transactions?.amountCollected?.toLocaleString("en-IN") || 0}`,
      subValue: `${stats?.transactions?.paymentCount || 0} Payments collected`,
      icon: ArrowDownLeft,
      color: "emerald"
    }
  ];

  // Prepare chart data comparing Credit Given vs Collected
  const chartData = [
    {
      name: "Platform Transactions",
      "Credit Given": stats?.transactions?.creditGiven || 0,
      "Amount Collected": stats?.transactions?.amountCollected || 0,
      "Net Outstanding": stats?.transactions?.pendingAmount || 0
    }
  ];

  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Platform Admin Control
        </h1>
        <p className="text-sm text-slate-500">
          Monitor platform registries, system stats, and shopkeeper logs
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {kpi.value}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    {kpi.subValue}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${colors[kpi.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Recent Signups panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Financial Registry Summary
            </h3>
            <span className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Platform Flow</span>
            </span>
          </div>

          <div className="mt-8 h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={64}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-900" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none"
                  }}
                />
                <Legend />
                <Bar name="Credit Given (Udhaar)" dataKey="Credit Given" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                <Bar name="Collected" dataKey="Amount Collected" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar name="Outstanding Balance" dataKey="Net Outstanding" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registered Shopkeepers */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Recent Registrations
            </h3>
            <Link to="/admin/users" className="text-xs font-bold text-indigo-600 hover:text-indigo-550 dark:text-indigo-400">
              Manage
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-50 dark:divide-slate-900">
            {stats?.recentShopkeepers?.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No shopkeepers registered yet
              </div>
            ) : (
              stats?.recentShopkeepers?.map((shop) => (
                <div key={shop._id} className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {shop.shopName}
                    </h4>
                    <p className="text-xs text-slate-400">{shop.name} | {shop.email}</p>
                  </div>
                  <span>
                    {shop.status === "active" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                        <UserCheck className="h-3 w-3 mr-0.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                        <UserX className="h-3 w-3 mr-0.5" />
                        Suspended
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
