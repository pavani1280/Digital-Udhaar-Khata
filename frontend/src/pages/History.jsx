import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings } from "../store/settingsSlice.js";
import API from "../utils/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CalendarDays, FileText, Printer, Search, WalletCards } from "lucide-react";
import html2pdf from "html2pdf.js";

const formatDisplayDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

const History = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.settings);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportMode, setReportMode] = useState("all");
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");

  const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

  const filters = useMemo(() => {
    const params = {};
    if (type) params.type = type;
    if (reportMode === "single" && singleDate) {
      params.startDate = singleDate;
      params.endDate = singleDate;
    }
    if (reportMode === "range") {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
    }
    return params;
  }, [endDate, reportMode, singleDate, startDate, type]);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const response = await API.get("/transactions", { params: filters });
        setTransactions(response.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [filters]);

  const totals = transactions.reduce(
    (acc, item) => {
      if (item.type === "credit") acc.credit += Number(item.amount || 0);
      if (item.type === "payment") acc.payment += Number(item.amount || 0);
      return acc;
    },
    { credit: 0, payment: 0 }
  );

  const reportTitle = () => {
    if (reportMode === "single") {
      return `Single Day Records - ${singleDate ? formatDisplayDate(singleDate) : "Selected Date"}`;
    }
    if (reportMode === "range") {
      return `Multiple Day Records - ${startDate ? formatDisplayDate(startDate) : "Start"} to ${endDate ? formatDisplayDate(endDate) : "End"}`;
    }
    return "All Transaction Records";
  };

  const handlePrint = () => {
    const rows = transactions
      .map((item) => `
        <tr>
          <td>${formatDisplayDate(item.date)}</td>
          <td>${item.customerId?.name || "Customer"}</td>
          <td>${item.customerId?.phone || "-"}</td>
          <td>${item.description || "No description"}</td>
          <td>${item.type === "credit" ? "Credit" : "Payment"}</td>
          <td class="amount">${currencySymbol}${Number(item.amount || 0).toLocaleString("en-IN")}</td>
        </tr>
      `)
      .join("");

    const htmlContent = `
      <!doctype html>
      <html>
        <head>
          <title>${reportTitle()}</title>
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
          </style>
        </head>
        <body>
          <h1>${reportTitle()}</h1>
          <p class="muted">Generated ${formatDisplayDate(new Date())}</p>
          <div class="summary">
            <div class="box"><div class="label">Credit Given</div><div class="value">${currencySymbol}${totals.credit.toLocaleString("en-IN")}</div></div>
            <div class="box"><div class="label">Payments Received</div><div class="value">${currencySymbol}${totals.payment.toLocaleString("en-IN")}</div></div>
            <div class="box"><div class="label">Net Outstanding</div><div class="value">${currencySymbol}${(totals.credit - totals.payment).toLocaleString("en-IN")}</div></div>
          </div>
          <table>
            <thead>
              <tr><th>Date</th><th>Customer</th><th>Phone</th><th>Description</th><th>Type</th><th class="amount">Amount</th></tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="6">No records found.</td></tr>`}</tbody>
          </table>
        </body>
      </html>
    `;

    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    const filename = `transaction-records-${new Date().getTime()}.pdf`;
    
    const options = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
    };
    
    html2pdf().set(options).from(element).save().catch(() => {
      alert("Failed to download PDF. Please try again.");
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            History Records
          </h1>
          <p className="text-sm text-slate-500">View all transaction records and print single-day or multiple-day reports.</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          <Printer className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-md dark:border-rose-950/30 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Credit Given</p>
          <p className="mt-3 text-2xl font-black text-rose-500">{currencySymbol}{totals.credit.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-md dark:border-emerald-950/30 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Payments Received</p>
          <p className="mt-3 text-2xl font-black text-emerald-500">{currencySymbol}{totals.payment.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-md dark:border-indigo-950/30 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Records Balance</p>
          <p className="mt-3 text-2xl font-black text-indigo-600">{currencySymbol}{(totals.credit - totals.payment).toLocaleString("en-IN")}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <FileText className="h-3.5 w-3.5" />
              <span>Records Type</span>
            </label>
            <select
              value={reportMode}
              onChange={(e) => setReportMode(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">All Records</option>
              <option value="single">Single Day</option>
              <option value="range">Multiple Days</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <WalletCards className="h-3.5 w-3.5" />
              <span>Transaction Type</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="">All Transactions</option>
              <option value="credit">Credit</option>
              <option value="payment">Payment</option>
            </select>
          </div>

          {reportMode === "single" ? (
            <div className="space-y-1 lg:col-span-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Single Day</span>
              </label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              />
            </div>
          ) : reportMode === "range" ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center rounded-2xl border border-dashed border-slate-200 px-4 py-2 text-sm font-medium text-slate-400 dark:border-slate-800 lg:col-span-2">
              All transaction records are included.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{reportTitle()}</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-800">
            No records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-900">
                  <th className="py-3">Date</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Type</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {transactions.map((item) => (
                  <tr key={item._id} className="text-slate-600 dark:text-slate-300">
                    <td className="py-3">{formatDisplayDate(item.date)}</td>
                    <td className="py-3">
                      <p className="font-semibold">{item.customerId?.name || "Customer"}</p>
                      <p className="text-xs text-slate-400">{item.customerId?.phone || "-"}</p>
                    </td>
                    <td className="py-3 text-xs font-medium">{item.description || "No description"}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.type === "credit" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"}`}>
                        {item.type === "credit" ? "Credit" : "Payment"}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-black ${item.type === "credit" ? "text-rose-500" : "text-emerald-500"}`}>
                      {currencySymbol}{Number(item.amount || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default History;
