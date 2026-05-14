"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest, getCookie } from "../core/api";
import { Briefcase, TrendingUp, IndianRupee, Repeat, Search, ArrowUpRight, ArrowDownRight, ShieldCheck } from "lucide-react";

export default function PortfolioPage() {
    const [investorId, setInvestorId] = useState("");
    const [portfolios, setPortfolios] = useState([]);
    const [sips, setSips] = useState([]);
    const [funds, setFunds] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadPortfolio = async (id = "") => {
        setError("");
        try {
            setLoading(true);
            const role = getCookie("role");
            const cookieInvestorId = getCookie("investor_id");
            const selectedId = id || (role == "investor" ? cookieInvestorId : "");
            const [portfolioResult, sipResult, fundResult, transactionResult] = await Promise.all([
                apiRequest(selectedId ? `/portfolio/${selectedId}` : "/portfolio"),
                apiRequest("/sip"), apiRequest("/fund"), apiRequest("/sip/transactions"),
            ]);
            setPortfolios(Array.isArray(portfolioResult) ? portfolioResult : []);
            setSips(Array.isArray(sipResult) ? sipResult : []);
            setFunds(Array.isArray(fundResult) ? fundResult : []);
            setTransactions(Array.isArray(transactionResult) ? transactionResult : []);
        } catch (error) { setError(error.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadPortfolio(""); }, []);

    const totals = useMemo(() => {
        const totalInvested = portfolios.reduce((sum, item) => sum + Number(item.total_invested || 0), 0);
        const currentValue = portfolios.reduce((sum, item) => sum + Number(item.current_value || 0), 0);
        const profitLoss = portfolios.reduce((sum, item) => sum + Number(item.net_profit_loss || 0), 0);
        const activeSips = sips.filter((sip) => sip.sip_status == "Active").length;
        return { totalInvested, currentValue, profitLoss, activeSips };
    }, [portfolios, sips]);

    const riskCounts = useMemo(() => funds.reduce((items, fund) => {
        const risk = fund.risk_level || "Unknown";
        items[risk] = (items[risk] || 0) + 1;
        return items;
    }, {}), [funds]);

    return (
        <DashboardShell title="Portfolio" subtitle="Portfolio value, active SIPs, mutual fund exposure, and investment activity">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up">
                <Metric title="Total Invested" value={`Rs ${totals.totalInvested.toLocaleString()}`} icon={<IndianRupee size={18} />} gradient="from-blue-500 to-cyan-500" />
                <Metric title="Current Value" value={`Rs ${totals.currentValue.toLocaleString()}`} icon={<TrendingUp size={18} />} gradient="from-indigo-500 to-purple-600" />
                <Metric title="Profit / Loss" value={`Rs ${totals.profitLoss.toLocaleString()}`} icon={totals.profitLoss >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />} gradient={totals.profitLoss >= 0 ? "from-emerald-500 to-teal-500" : "from-red-500 to-rose-500"} />
                <Metric title="Active SIPs" value={totals.activeSips} icon={<Repeat size={18} />} gradient="from-amber-500 to-orange-500" />
            </div>

            <div className="mt-6 rounded-2xl theme-bg-card border theme-border-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><Search size={18} className="text-indigo-400" /></div>
                        <div>
                            <h2 className="text-lg font-bold theme-text-primary">Portfolio Search</h2>
                            <p className="text-xs theme-text-dim">Admin can leave empty for all portfolios; investor accounts load their own by default.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input className="rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={investorId} onChange={(e) => setInvestorId(e.target.value)} placeholder="Investor ID" />
                        <button onClick={() => loadPortfolio(investorId.trim())} disabled={loading} className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                            {loading ? "Loading..." : "Load"}
                        </button>
                    </div>
                </div>
                {error ? <p className="mt-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr] animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><Briefcase size={18} className="text-indigo-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Portfolio Valuation</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Portfolio</th>
                                    <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Investor</th>
                                    <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Invested</th>
                                    <th className="py-3.5 pr-4 text-xs font-semibold tracking-wider theme-text-dim uppercase">Current</th>
                                    <th className="py-3.5 text-xs font-semibold tracking-wider theme-text-dim uppercase">P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolios.map((portfolio, i) => (
                                    <tr key={portfolio.portfolio_id} className="border-b border-slate-800/50 hover:bg-table-row transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <td className="py-4 pr-4 font-semibold theme-text-primary">{portfolio.portfolio_name}</td>
                                        <td className="py-4 pr-4 theme-text-secondary">{portfolio.investor_id}</td>
                                        <td className="py-4 pr-4 theme-text-secondary">{portfolio.total_invested}</td>
                                        <td className="py-4 pr-4 theme-text-secondary">{portfolio.current_value}</td>
                                        <td className="py-4 font-semibold text-emerald-400">{portfolio.net_profit_loss}</td>
                                    </tr>
                                ))}
                                {portfolios.length === 0 && <tr><td colSpan={5} className="py-12 text-center theme-text-dim">No portfolio data. Click "Load" to fetch.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"><ShieldCheck size={18} className="text-amber-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Risk Score</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(riskCounts).map(([risk, count], i) => (
                            <div key={risk} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium theme-text-secondary">{risk}</span>
                                    <span className="theme-text-dim">{count} funds</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                    <div className={`h-full rounded-full ${risk === "High" ? "bg-gradient-to-r from-red-500 to-rose-500" : risk === "Medium" ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`} style={{ width: `${Math.min(100, Number(count) * 20)}%` }} />
                                </div>
                            </div>
                        ))}
                        {Object.keys(riskCounts).length === 0 && <p className="text-sm theme-text-dim text-center py-8">No risk data available</p>}
                    </div>
                    <div className="mt-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-5">
                        <p className="text-sm theme-text-muted">Latest Transactions</p>
                        <p className="mt-2 text-3xl font-bold theme-text-primary">{transactions.length}</p>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function Metric({ title, value, icon, gradient = "from-indigo-500 to-purple-600" }) {
    return (
        <div className="rounded-2xl theme-bg-card border theme-border-card p-5 card-hover group">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide theme-text-muted uppercase">{title}</p>
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>{icon}</div>
            </div>
            <p className="mt-4 text-2xl font-bold theme-text-primary tracking-tight">{value}</p>
        </div>
    );
}
