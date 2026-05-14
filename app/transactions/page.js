"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";
import { ReceiptText, Search, AlertCircle } from "lucide-react";

export default function TransactionsPage() {
    const [sipId, setSipId] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        setError("");
        setMessage("");
        try {
            const path = sipId.trim() ? `/sip/transactions/${sipId.trim()}` : "/sip/transactions";
            const result = await apiRequest(path);
            const data = Array.isArray(result) ? result : [];
            setTransactions(data);
            if (data.length === 0 && sipId.trim()) {
                setMessage(`No transactions found for SIP ID: ${sipId.trim()}`);
            } else {
                setMessage(sipId.trim() ? `Found ${data.length} transaction(s) for ${sipId.trim()}` : `All ${data.length} transaction(s) fetched`);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <DashboardShell title="My Investor Transactions" subtitle="Transaction id, investor id, portfolio id, amount, and status">
            <div className="rounded-2xl theme-bg-card border theme-border-card p-6 animate-slide-up">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><ReceiptText size={18} className="text-indigo-400" /></div>
                        <div>
                            <h2 className="text-lg font-bold theme-text-primary">Transactions</h2>
                            <p className="text-xs theme-text-dim">All SIP transactions and their status</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input className="rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] w-56"
                            value={sipId} onChange={(e) => setSipId(e.target.value)} placeholder="Leave empty for all transactions" />
                        <button onClick={fetchTransactions} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 flex items-center gap-2">
                            <Search size={16} />{sipId.trim() ? "Search" : "Get All"}
                        </button>
                    </div>
                </div>
                {message ? <p className="mb-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-2"><AlertCircle size={14} />{message}</p> : null}
                {error ? <p className="mb-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Transaction ID</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Investor ID</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Portfolio ID</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Txn Amount</th>
                                <th className="py-3.5 text-xs font-semibold tracking-wider theme-text-dim uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, i) => {
                                const status = transaction.transaction_status || transaction.status;
                                return (
                                    <tr key={transaction.transaction_id} className="border-b border-slate-800/50 hover:bg-table-row transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <td className="py-4 pr-4 font-semibold theme-text-primary">{transaction.transaction_id}</td>
                                        <td className="py-4 pr-4 theme-text-secondary">{transaction.investor_id}</td>
                                        <td className="py-4 pr-4 theme-text-secondary">{transaction.portfolio_id || transaction.fund_id || transaction.sip_id}</td>
                                        <td className="py-4 pr-4 font-semibold theme-text-primary">{transaction.transaction_amount}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                status == "Success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                                                status == "Failed" ? "bg-red-500/10 text-red-300 border border-red-500/20" :
                                                "bg-amber-500/10 text-amber-300 border border-amber-500/20"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status == "Success" ? "bg-emerald-400" : status == "Failed" ? "bg-red-400" : "bg-amber-400"}`} />
                                                {status || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {transactions.length === 0 && (
                                <tr><td colSpan={5} className="py-12 text-center theme-text-dim">No transactions found. Enter a SIP ID and click Search, or click Get All.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardShell>
    );
}
