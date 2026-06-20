import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerById } from "../store/customerSlice.js";
import { fetchTransactions } from "../store/transactionSlice.js";
import { getReminderMessage, clearReminderPayload, getAIReminderMessage } from "../store/notificationSlice.js";
import { fetchSettings } from "../store/settingsSlice.js";
import API from "../utils/api.js";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Send,
  Plus,
  Copy,
  Check,
  ExternalLink,
  X,
  CalendarDays,
  Sparkles,
  FileText,
  Printer,
  CalendarClock
} from "lucide-react";
import TransactionModal from "../components/TransactionModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCustomer, loading: custLoading } = useSelector((state) => state.customers);
  const { transactions, loading: transLoading } = useSelector((state) => state.transactions);
  const { settings } = useSelector((state) => state.settings);
  const { reminderPayload } = useSelector((state) => state.notifications);

  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportMode, setReportMode] = useState("all");
  const [reportDate, setReportDate] = useState("");
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [isReminderViewerOpen, setIsReminderViewerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("friendly");

  useEffect(() => {
    dispatch(fetchCustomerById(id));
    dispatch(fetchSettings());
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        customerId: id,
        type: filterType || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      })
    );
  }, [dispatch, id, filterType, startDate, endDate]);

  const handleOpenTransModal = () => {
    setIsTransModalOpen(true);
  };

  const handleGenerateReminder = async () => {
    const result = await dispatch(getReminderMessage(id));
    if (result.meta.requestStatus === "fulfilled") {
      setIsReminderViewerOpen(true);
    }
  };

  const handleGenerateAIReminder = async () => {
    try {
      setAiLoading(true);
      await dispatch(getAIReminderMessage({ customerId: id, tone: selectedTone })).unwrap();
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
    dispatch(clearReminderPayload());
  };

  const formatDisplayDate = (value) =>
    new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  const buildReportTitle = () => {
    if (reportMode === "single") {
      return `Single Day Report - ${reportDate ? formatDisplayDate(reportDate) : "Selected Date"}`;
    }
    if (reportMode === "range") {
      return `Date Range Report - ${reportStartDate ? formatDisplayDate(reportStartDate) : "Start"} to ${reportEndDate ? formatDisplayDate(reportEndDate) : "End"}`;
    }
    return "Complete Transaction Report";
  };

  const openPrintableReport = (reportTransactions) => {
    const totalCredit = reportTransactions
      .filter((item) => item.type === "credit")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalPayment = reportTransactions
      .filter((item) => item.type === "payment")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const netBalance = totalCredit - totalPayment;

    const rows = reportTransactions
      .map((item) => `
        <tr>
          <td>${formatDisplayDate(item.date)}</td>
          <td>${item.customerId?.name || currentCustomer.name}</td>
          <td>${item.description || "No description"}</td>
          <td>${item.type === "credit" ? "Credit" : "Payment"}</td>
          <td class="amount">${currencySymbol}${Number(item.amount || 0).toLocaleString("en-IN")}</td>
        </tr>
      `)
      .join("");

    const reportWindow = window.open("", "_blank", "width=900,height=700");
    if (!reportWindow) {
      alert("Please allow pop-ups to save the report PDF.");
      return;
    }

    reportWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${buildReportTitle()}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
            h1 { margin: 0; font-size: 24px; }
            .muted { color: #64748b; font-size: 12px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
            .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
            .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; }
            .value { font-size: 18px; font-weight: 800; margin-top: 4px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background: #f8fafc; text-transform: uppercase; font-size: 10px; letter-spacing: .06em; color: #475569; }
            .amount { text-align: right; font-weight: 700; }
            .hidden-button { display: none; }
            @media print { button { display: none; } body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${buildReportTitle()}</h1>
          <p class="muted">${currentCustomer.name} · ${currentCustomer.phone} · Generated ${formatDisplayDate(new Date())}</p>
          <div class="summary">
            <div class="box"><div class="label">Credit Given</div><div class="value">${currencySymbol}${totalCredit.toLocaleString("en-IN")}</div></div>
            <div class="box"><div class="label">Payments Received</div><div class="value">${currencySymbol}${totalPayment.toLocaleString("en-IN")}</div></div>
            <div class="box"><div class="label">Net Outstanding</div><div class="value">${currencySymbol}${netBalance.toLocaleString("en-IN")}</div></div>
          </div>
          <table>
            <thead>
              <tr><th>Date</th><th>Customer</th><th>Description</th><th>Type</th><th class="amount">Amount</th></tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="5">No transactions found for this report.</td></tr>`}</tbody>
          </table>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
  };

  const handleGenerateReport = async () => {
    if (reportMode === "single" && !reportDate) {
      alert("Please select a report date.");
      return;
    }
    if (reportMode === "range" && (!reportStartDate || !reportEndDate)) {
      alert("Please select both start and end dates.");
      return;
    }

    const params = { customerId: id };
    if (reportMode === "single") {
      params.startDate = reportDate;
      params.endDate = reportDate;
    }
    if (reportMode === "range") {
      params.startDate = reportStartDate;
      params.endDate = reportEndDate;
    }

    try {
      setReportLoading(true);
      const response = await API.get("/transactions", { params });
      openPrintableReport(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate transaction report.");
    } finally {
      setReportLoading(false);
    }
  };

  const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

  if (custLoading && !currentCustomer) {
    return <LoadingSpinner fullPage />;
  }

  if (!currentCustomer) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Customer not found</h3>
        <Link to="/customers" className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Customers list
        </Link>
      </div>
    );
  }

  const owesMoney = currentCustomer.balance > 0;
  const hasSurplus = currentCustomer.balance < 0;
  const reminderDate = currentCustomer.reminderDate ? formatDisplayDate(currentCustomer.reminderDate) : null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Back link & Actions header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Link
            to="/customers"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {currentCustomer.name}
            </h1>
            <p className="text-xs text-slate-500">Customer ledger history log</p>
          </div>
        </div>

        <button
          onClick={handleOpenTransModal}
          className="flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 dark:shadow-none transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Ledger Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Customer Summary Info & Reminder actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Customer Card */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Customer Info
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentCustomer.name}
            </h3>

            <div className="mt-4 space-y-2.5 text-sm text-slate-500">
              <p className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{currentCustomer.phone}</span>
              </p>
              <p className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{currentCustomer.address}</span>
              </p>
              {reminderDate && (
                <p className="flex items-center space-x-2.5">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Reminder: {reminderDate}</span>
                </p>
              )}
            </div>
          </div>

          {/* Balance Card */}
          <div
            className={`rounded-3xl border p-6 text-center shadow-md ${
              owesMoney
                ? "border-rose-200 bg-rose-50/20 dark:border-rose-950/30 dark:bg-rose-950/10"
                : hasSurplus
                ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/30 dark:bg-emerald-950/10"
                : "border-slate-200 bg-slate-50/30 dark:border-slate-900/30 dark:bg-slate-950"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Net Balance Due
            </span>
            <h2
              className={`mt-2 text-3xl font-black ${
                owesMoney ? "text-rose-500" : hasSurplus ? "text-emerald-500" : "text-slate-500"
              }`}
            >
              {currencySymbol}
              {Math.abs(currentCustomer.balance).toLocaleString("en-IN")}
            </h2>
            <p className="mt-2 text-xs text-slate-400 font-medium">
              {owesMoney
                ? "Customer owes you money"
                : hasSurplus
                ? "You owe the customer"
                : "All accounts are settled"}
            </p>
          </div>

          {/* Quick Reminder Dispatch Card */}
          {owesMoney && (
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Payment Reminder
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Generate a ready-to-send payment reminder matching your customized template settings
              </p>

              <button
                onClick={handleGenerateReminder}
                className="mt-4 flex w-full items-center justify-center space-x-2 rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 dark:shadow-none transition-all duration-200"
              >
                <Send className="h-4 w-4" />
                <span>Simulate / Send Reminder</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Chronological Ledger Entries */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span>Transaction PDF Report</span>
                </h3>
                <p className="text-xs text-slate-400">Create a complete, single-day, or multiple-day report.</p>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:bg-indigo-400"
              >
                <Printer className="h-4 w-4" />
                <span>{reportLoading ? "Preparing..." : "Download PDF"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Report Type</label>
                <select
                  value={reportMode}
                  onChange={(e) => setReportMode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                >
                  <option value="all">Whole Transaction</option>
                  <option value="single">Single Day</option>
                  <option value="range">Multiple Days</option>
                </select>
              </div>

              {reportMode === "single" ? (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Report Date</label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                  />
                </div>
              ) : reportMode === "range" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</label>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-2 text-xs font-medium text-slate-400 dark:border-slate-800 sm:col-span-2">
                  Includes all transactions for this customer.
                </div>
              )}
            </div>
          </div>

          {/* Ledger Filters */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Ledger Filters
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                >
                  <option value="">All Transactions</option>
                  <option value="credit">Give Credit (Udhaar)</option>
                  <option value="payment">Receive Payment</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
              Ledger Timeline
            </h3>

            {transLoading && transactions.length === 0 ? (
              <LoadingSpinner />
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400 border border-dashed border-slate-150 rounded-xl dark:border-slate-800">
                <CalendarDays className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                <p>No transactions match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider dark:border-slate-900">
                      <th className="py-3">Date</th>
                      <th className="py-3">Description</th>
                      <th className="py-3">Type</th>
                      <th className="py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900 text-sm">
                    {transactions.map((trans) => (
                      <tr key={trans._id} className="text-slate-600 dark:text-slate-300">
                        <td className="py-3.5">
                          {new Date(trans.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-3.5 text-xs font-medium">
                          {trans.description || <span className="text-slate-300 dark:text-slate-700 italic">No description</span>}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              trans.type === "credit"
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            }`}
                          >
                            {trans.type === "credit" ? "Credit" : "Payment"}
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Entry Modal locked to customer */}
      <TransactionModal
        isOpen={isTransModalOpen}
        onClose={() => setIsTransModalOpen(false)}
        selectedCustomerId={id}
      />

      {/* Reminder Message Generated View Modal */}
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

export default CustomerDetails;
