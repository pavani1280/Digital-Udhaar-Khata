import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopkeeperStats, fetchMonthlyReport, fetchTransactions } from "../store/transactionSlice.js";
import { fetchCustomers } from "../store/customerSlice.js";
import { getReminderMessage, clearReminderPayload, getAIReminderMessage } from "../store/notificationSlice.js";
import { fetchSettings } from "../store/settingsSlice.js";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  CircleDollarSign,
  Plus,
  Send,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  X,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomerModal from "../components/CustomerModal.jsx";
import TransactionModal from "../components/TransactionModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
// eslint-disable-next-line no-unused-vars

const Dashboard = () => {
  const dispatch = useDispatch();

  const { stats, report, transactions, loading: transLoading } = useSelector((state) => state.transactions);
  const { customers } = useSelector((state) => state.customers);
  const { settings } = useSelector((state) => state.settings);
  const { reminderPayload } = useSelector((state) => state.notifications);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // States for reminder payload viewer modal
  const [isReminderViewerOpen, setIsReminderViewerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("friendly");

  useEffect(() => {
    dispatch(fetchShopkeeperStats());
    dispatch(fetchMonthlyReport());
    dispatch(fetchTransactions({ limit: 5 }));
    dispatch(fetchCustomers());
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleOpenTransModal = (customerId = null) => {
    setSelectedCustomerId(customerId);
    setIsTransModalOpen(true);
  };

  const handleGenerateReminder = async (customerId) => {
    setSelectedCustomerId(customerId);
    const result = await dispatch(getReminderMessage(customerId));
    if (result.meta.requestStatus === "fulfilled") {
      setIsReminderViewerOpen(true);
    }
  };

  const handleGenerateAIReminder = async () => {
    if (!selectedCustomerId) return;
    try {
      setAiLoading(true);
      await dispatch(getAIReminderMessage({ customerId: selectedCustomerId, tone: selectedTone })).unwrap();
    } catch (err) {
      console.error(err);
      alert(err || "Failed to generate AI reminder");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyReminder = () => {
    if (reminderPayload?.formattedMessage) {
      navigator.clipboard.writeText(reminderPayload.formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseReminderViewer = () => {
    setIsReminderViewerOpen(false);
    setSelectedCustomerId(null);
    dispatch(clearReminderPayload());
  };

  const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

  // Filter customers with positive outstanding balance
  const dueCustomers = customers
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  const kpis = [
    {
      label: "Total Customers",
      value: stats.totalCustomers || 0,
      icon: Users,
      color: "indigo"
    },
    {
      label: "Total Credit Given",
      value: `${currencySymbol}${stats.totalCredit?.toLocaleString("en-IN") || 0}`,
      icon: ArrowUpRight,
      color: "rose"
    },
    {
      label: "Amount Collected",
      value: `${currencySymbol}${stats.totalCollected?.toLocaleString("en-IN") || 0}`,
      icon: ArrowDownLeft,
      color: "emerald"
    },
    {
      label: "Outstanding Balance",
      value: `${currencySymbol}${stats.pendingBalance?.toLocaleString("en-IN") || 0}`,
      icon: CircleDollarSign,
      color: "amber"
    }
  ];

  // Skeleton pulse component for loading state
  const KpiSkeleton = () => (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitor credits given, payments collected, and customer outstanding balances
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center space-x-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
          <button
            onClick={() => handleOpenTransModal()}
            className="flex items-center space-x-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 dark:shadow-none transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid — show skeletons while loading */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {transLoading && stats.totalCustomers === 0 ? (
          [0, 1, 2, 3].map((i) => <KpiSkeleton key={i} />)
        ) : (
          kpis.map((kpi) => {
            const Icon = kpi.icon;
            const bgColors = {
              indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
              rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
              emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
              amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
            };
            return (
              <div
                key={kpi.label}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {kpi.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-100">
                      {kpi.value}
                    </h3>
                  </div>
                  <div className={`rounded-2xl p-3 ${bgColors[kpi.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Analytics Chart section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Charts area */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Daily Credit vs Payments
            </h3>
            <span className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Net Analysis</span>
            </span>
          </div>

          <div className="mt-6 h-80 w-full text-xs">
            {report.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <p>No transaction data available to plot graphs.</p>
                <p className="text-xs">Record credit or collection to generate charts.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    name="Credit Given"
                    dataKey="credit"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCredit)"
                  />
                  <Area
                    type="monotone"
                    name="Collected"
                    dataKey="payment"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPayment)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Due Payments Sidepanel */}
        <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Overdue Reminders
            </h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-500 dark:bg-rose-950/20">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-50 dark:divide-slate-900">
            {dueCustomers.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                All customer balances are fully settled!
              </div>
            ) : (
              dueCustomers.map((cust) => (
                <div key={cust._id} className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {cust.name}
                    </h4>
                    <p className="text-xs text-slate-400">{cust.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-rose-500">
                      {currencySymbol}{cust.balance}
                    </span>
                    <button
                      onClick={() => handleGenerateReminder(cust._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                      title="Send WhatsApp Reminder"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {dueCustomers.length > 0 && (
            <Link
              to="/customers"
              className="mt-4 flex items-center justify-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <span>View all customer ledgers</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Recent Ledger Entries list */}
      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 dark:border-slate-900">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Recent Ledger Entries
          </h3>
          <Link
            to="/customers"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Manage Ledgers
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          {transLoading && transactions.length === 0 ? (
            <div className="animate-pulse space-y-3 py-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="h-4 flex-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-14 rounded-full bg-slate-200 dark:bg-slate-800 ml-auto" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No transactions registered yet. Record credit or payment.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider dark:border-slate-900">
                  <th className="py-3">Customer</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Type</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900 text-sm">
                {transactions.slice(0, 5).map((trans) => (
                  <tr key={trans._id} className="text-slate-600 dark:text-slate-300">
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {trans.customerId?.name || "Deleted Customer"}
                    </td>
                    <td className="py-3.5">
                      {new Date(trans.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-3.5 text-xs italic">{trans.description || "--"}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          trans.type === "credit"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        }`}
                      >
                        {trans.type === "credit" ? "Credit" : "Collected"}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 text-right font-extrabold ${
                        trans.type === "credit" ? "text-rose-500" : "text-emerald-500"
                      }`}
                    >
                      {trans.type === "credit" ? "+" : "-"}
                      {currencySymbol}
                      {trans.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Create Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />

      {/* Record Transaction Modal */}
      <TransactionModal
        isOpen={isTransModalOpen}
        onClose={() => setIsTransModalOpen(false)}
        selectedCustomerId={selectedCustomerId}
      />

      {/* WhatsApp Message Template Simulation Viewer */}
      {isReminderViewerOpen && reminderPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-900">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Reminder Message Generated
              </h3>
              <button
                onClick={handleCloseReminderViewer}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Recipient
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {reminderPayload.recipientPhone}
                </p>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mt-3">
                  Parsed SMS/WhatsApp Message
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic mt-1 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{reminderPayload.formattedMessage}"
                </p>

                {/* AI Remaster Section */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Personalize with Gemini AI
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    {["friendly", "professional", "urgent"].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setSelectedTone(tone)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold capitalize transition cursor-pointer ${
                          selectedTone === tone
                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/45 dark:border-indigo-900/60 dark:text-indigo-400"
                            : "border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAIReminder}
                    disabled={aiLoading}
                    className="w-full mt-3 flex items-center justify-center space-x-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50 cursor-pointer"
                  >
                    {aiLoading ? (
                      <span>Generating AI Reminder...</span>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Rewrite with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleCopyReminder}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://wa.me/${reminderPayload.recipientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    reminderPayload.formattedMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-100 hover:bg-emerald-600 dark:shadow-none"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Send WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
