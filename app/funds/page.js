"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";
import { Plus, RefreshCw, Wallet, Search } from "lucide-react";

const initialFund = {
    fund_id: "", fund_name: "", amc_name: "", fund_type: "",
    category: "", nav_value: "", nav_date: "", risk_level: "",
};

export default function FundsPage() {
    const [funds, setFunds] = useState([]);
    const [fundForm, setFundForm] = useState(initialFund);
    const [navForm, setNavForm] = useState({ fund_id: "", nav_value: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const setFundValue = (name, value) => setFundForm((p) => ({ ...p, [name]: value }));
    const resetStatus = () => { setError(""); setMessage(""); };

    const fetchFunds = async () => {
        resetStatus();
        try {
            setLoading("list");
            const result = await apiRequest("/fund");
            setFunds(Array.isArray(result) ? result : []);
            setMessage("Funds fetched successfully");
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    const createFund = async (event) => {
        event.preventDefault();
        resetStatus();
        try {
            setLoading("create");
            const result = await apiRequest("/fund", {
                method: "POST",
                body: JSON.stringify({ ...fundForm, nav_value: Number(fundForm.nav_value) }),
            });
            setMessage(typeof result == "string" ? result : "Fund Added Successfully");
            setFundForm(initialFund);
            await fetchFunds();
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    const updateNav = async (event) => {
        event.preventDefault();
        resetStatus();
        try {
            setLoading("nav");
            const result = await apiRequest(`/fund/${navForm.fund_id}/nav`, {
                method: "PUT",
                body: JSON.stringify({ nav_value: Number(navForm.nav_value) }),
            });
            setMessage(typeof result == "string" ? result : "NAV Updated Successfully");
            setNavForm({ fund_id: "", nav_value: "" });
            await fetchFunds();
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    return (
        <DashboardShell title="Mutual Funds" subtitle="Create mutual funds, fetch schemes, and update NAV values">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] animate-slide-up">
                <form onSubmit={createFund} className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><Plus size={18} className="text-indigo-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Create Mutual Fund</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.keys(initialFund).map((name) => (
                            <label key={name} className="text-sm font-medium theme-text-muted">
                                {name.replaceAll("_", " ")}
                                <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                                    type={name == "nav_date" ? "date" : name == "nav_value" ? "number" : "text"}
                                    value={fundForm[name]} onChange={(e) => setFundValue(name, e.target.value)} required />
                            </label>
                        ))}
                    </div>
                    <button disabled={loading == "create"} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                        {loading == "create" ? "Adding..." : "Add Mutual Fund"}
                    </button>
                </form>

                <form onSubmit={updateNav} className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"><RefreshCw size={18} className="text-emerald-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Update NAV</h2>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium theme-text-muted">
                            Fund ID
                            <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Enter Fund ID" value={navForm.fund_id} onChange={(e) => setNavForm((p) => ({ ...p, fund_id: e.target.value }))} required />
                        </label>
                        <label className="block text-sm font-medium theme-text-muted">
                            NAV Value
                            <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" type="number" placeholder="Enter NAV value" value={navForm.nav_value} onChange={(e) => setNavForm((p) => ({ ...p, nav_value: e.target.value }))} required />
                        </label>
                    </div>
                    <button disabled={loading == "nav"} className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                        {loading == "nav" ? "Updating..." : "Update NAV"}
                    </button>
                </form>
            </div>

            <div className="mt-6 rounded-2xl theme-bg-card border theme-border-card p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center"><Wallet size={18} className="text-blue-400" /></div>
                        <div>
                            <h2 className="text-lg font-bold theme-text-primary">Fund Schemes</h2>
                            <p className="text-xs theme-text-dim">All registered mutual fund schemes</p>
                        </div>
                    </div>
                    <button onClick={fetchFunds} disabled={loading == "list"} className="btn-secondary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <Search size={16} />{loading == "list" ? "Loading..." : "Get Mutual Funds"}
                    </button>
                </div>
                {message ? <p className="mb-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">{message}</p> : null}
                {error ? <p className="mb-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Fund ID</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Fund Name</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">AMC</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Category</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">NAV</th>
                                <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">NAV Date</th>
                                <th className="py-3.5 text-xs font-semibold tracking-wider theme-text-dim uppercase">Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funds.map((fund, i) => (
                                <tr key={fund.fund_id} className="border-b border-slate-800/50 hover:bg-table-row transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <td className="py-4 pr-4 font-semibold theme-text-primary">{fund.fund_id}</td>
                                    <td className="py-4 pr-4 theme-text-secondary">{fund.fund_name}</td>
                                    <td className="py-4 pr-4 theme-text-secondary">{fund.amc_name}</td>
                                    <td className="py-4 pr-4"><span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-medium">{fund.category}</span></td>
                                    <td className="py-4 pr-4 theme-text-secondary">{fund.nav_value}</td>
                                    <td className="py-4 pr-4 theme-text-dim">{fund.nav_date}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                                            fund.risk_level === "High" ? "bg-red-500/10 text-red-300" :
                                            fund.risk_level === "Medium" ? "bg-amber-500/10 text-amber-300" :
                                            fund.risk_level === "Low" ? "bg-emerald-500/10 text-emerald-300" :
                                            "bg-slate-500/10 text-slate-400"}`}>{fund.risk_level}</span>
                                    </td>
                                </tr>
                            ))}
                            {funds.length === 0 && <tr><td colSpan={7} className="py-12 text-center theme-text-dim">Click "Get Mutual Funds" to load fund data</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardShell>
    );
}
