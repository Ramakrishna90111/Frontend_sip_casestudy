"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";

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
            setTransactions(Array.isArray(result) ? result : []);
            setMessage(sipId.trim() ? "SIP transactions fetched" : "All transactions fetched");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <DashboardShell title="My Investor Transactions" subtitle="Transaction id, investor id, portfolio id, amount, and status">
            <div className="rounded-xl bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-black">Transactions</h2>
                    <div className="flex gap-3">
                        <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-500" value={sipId} onChange={(event)=>setSipId(event.target.value)} placeholder="Leave empty for all transactions" />
                        <button onClick={fetchTransactions} className="rounded-lg bg-black px-6 py-3 font-semibold text-white">{sipId.trim() ? "Search Transactions" : "Get All Transactions"}</button>
                    </div>
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-teal-600">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-400">
                            <tr>
                                <th className="border-b py-3">Transaction ID</th>
                                <th className="border-b py-3">Investor ID</th>
                                <th className="border-b py-3">Portfolio ID</th>
                                <th className="border-b py-3">Txn.Amount</th>
                                <th className="border-b py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => {
                                const status = transaction.transaction_status || transaction.status;
                                return (
                                    <tr key={transaction.transaction_id} className="text-gray-700">
                                        <td className="border-b py-4 font-semibold text-black">{transaction.transaction_id}</td>
                                        <td className="border-b py-4">{transaction.investor_id}</td>
                                        <td className="border-b py-4">{transaction.portfolio_id || transaction.fund_id || transaction.sip_id}</td>
                                        <td className="border-b py-4 font-semibold text-black">{transaction.transaction_amount}</td>
                                        <td className="border-b py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status == "Success" ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"}`}>
                                                {status || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardShell>
    );
}
