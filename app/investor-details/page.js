"use client"
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";
import { Users, Wallet, TrendingUp, Search } from "lucide-react";

export default function InvestorDetailPage(){
    const [investorId, setInvestorId] = useState("");
    const [investors, setInvestors] = useState([]);
    const [investor, setInvestor] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [networth, setNetworth] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState("");

    const resetStatus = () => { setError(""); setMessage(""); };

    const fetchInvestor = async () => {
        resetStatus(); setInvestor(null); setInvestors([]);
        try {
            setLoading("investor");
            if (investorId.trim()) {
                const result = await apiRequest(`/investor/${investorId.trim()}`);
                setInvestor(result); setMessage("Investor details fetched");
            } else {
                const result = await apiRequest("/investor");
                setInvestors(Array.isArray(result) ? result : []);
                setMessage("All investor details fetched");
            }
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    const fetchHoldings = async () => {
        resetStatus(); setHoldings([]);
        try {
            setLoading("holdings");
            const result = await apiRequest(`/investor/holdings/${investorId}`);
            setHoldings(Array.isArray(result?.holdings) ? result.holdings : []);
            setMessage("Investor holdings fetched");
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    const fetchNetworth = async () => {
        resetStatus(); setNetworth(null);
        try {
            setLoading("networth");
            const result = await apiRequest(`/investor/networth/${investorId}`);
            setNetworth(result); setMessage("Investor networth fetched");
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    return (
        <DashboardShell title="Investor Details" subtitle="Fetch investor profile, holdings, and networth by investor id">
            <div className="rounded-2xl theme-bg-card border theme-border-card p-6 animate-slide-up">
                <div className="flex flex-wrap items-end gap-3">
                    <label className="text-sm font-medium theme-text-muted flex-1 min-w-[200px]">
                        Investor ID
                        <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={investorId} onChange={(e)=>setInvestorId(e.target.value)} placeholder="Leave empty for all investors" />
                    </label>
                    <button onClick={fetchInvestor} disabled={loading == "investor"} className="btn-secondary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <Search size={16} />{investorId.trim() ? "Search Investor" : "Get All Investors"}
                    </button>
                    <button onClick={fetchHoldings} disabled={loading == "holdings"} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center gap-2">
                        <Wallet size={16} />Get Holdings
                    </button>
                    <button onClick={fetchNetworth} disabled={loading == "networth"} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center gap-2">
                        <TrendingUp size={16} />Get Networth
                    </button>
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}

                {investor ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(investor).map(([key, value]) => (
                            <div key={key} className="rounded-xl theme-bg-input border theme-border-card p-4 animate-fade-in">
                                <p className="text-[10px] font-semibold uppercase tracking-wider theme-text-dim">{key}</p>
                                <p className="mt-1.5 text-sm font-semibold theme-text-primary">{String(value ?? "-")}</p>
                            </div>
                        ))}
                    </div>
                ) : null}

                {investors.length ? (
                    <div className="mt-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><Users size={16} className="text-indigo-400" /></div>
                            <h3 className="text-base font-bold theme-text-primary">All Investors</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Investor ID</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Name</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">PAN</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Email</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">DOB</th>
                                        <th className="py-3.5 text-xs font-semibold tracking-wider theme-text-dim uppercase">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investors.map((item, i) => (
                                        <tr key={item.investor_id} className="border-b border-slate-800/50 hover:bg-table-row transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                            <td className="py-4 pr-4 font-semibold theme-text-primary">{item.investor_id}</td>
                                            <td className="py-4 pr-4 theme-text-secondary">{[item.first_name, item.last_name].filter(Boolean).join(" ")}</td>
                                            <td className="py-4 pr-4 theme-text-secondary">{item.pan_no}</td>
                                            <td className="py-4 pr-4 theme-text-secondary">{item.email}</td>
                                            <td className="py-4 pr-4 theme-text-dim">{item.date_of_birth}</td>
                                            <td className="py-4 theme-text-secondary">{item.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {networth ? (
                    <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp size={18} className="text-emerald-400" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Networth</p>
                        </div>
                        <p className="text-3xl font-bold theme-text-primary">Rs {String(networth.networth ?? 0)}</p>
                    </div>
                ) : null}

                {holdings.length ? (
                    <div className="mt-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center"><Wallet size={16} className="text-blue-400" /></div>
                            <h3 className="text-base font-bold theme-text-primary">Holdings</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Fund Name</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Units Held</th>
                                        <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">NAV</th>
                                        <th className="py-3.5 text-xs font-semibold tracking-wider theme-text-dim uppercase">Current Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.map((holding, i) => (
                                        <tr key={`${holding.fund_name}-${i}`} className="border-b border-slate-800/50 hover:bg-table-row transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                            <td className="py-4 pr-4 font-semibold theme-text-primary">{holding.fund_name}</td>
                                            <td className="py-4 pr-4 theme-text-secondary">{holding.units_held}</td>
                                            <td className="py-4 pr-4 theme-text-secondary">{holding.nav_value}</td>
                                            <td className="py-4 font-semibold theme-text-primary">{holding.current_value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardShell>
    );
}
