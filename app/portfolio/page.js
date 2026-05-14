"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest, getCookie } from "../core/api";

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
                apiRequest("/sip"),
                apiRequest("/fund"),
                apiRequest("/sip/transactions"),
            ]);
            setPortfolios(Array.isArray(portfolioResult) ? portfolioResult : []);
            setSips(Array.isArray(sipResult) ? sipResult : []);
            setFunds(Array.isArray(fundResult) ? fundResult : []);
            setTransactions(Array.isArray(transactionResult) ? transactionResult : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPortfolio("");
    }, []);

    const totals = useMemo(() => {
        const totalInvested = portfolios.reduce((sum, item) => sum + Number(item.total_invested || 0), 0);
        const currentValue = portfolios.reduce((sum, item) => sum + Number(item.current_value || 0), 0);
        const profitLoss = portfolios.reduce((sum, item) => sum + Number(item.net_profit_loss || 0), 0);
        const activeSips = sips.filter((sip) => sip.sip_status == "Active").length;
        return { totalInvested, currentValue, profitLoss, activeSips };
    }, [portfolios, sips]);

    const riskCounts = useMemo(() => {
        return funds.reduce((items, fund) => {
            const risk = fund.risk_level || "Unknown";
            items[risk] = (items[risk] || 0) + 1;
            return items;
        }, {});
    }, [funds]);

    return (
        <DashboardShell title="Portfolio" subtitle="Portfolio value, active SIPs, mutual fund exposure, and investment activity">
            <div className="grid gap-5 md:grid-cols-4">
                <Metric title="Total Invested" value={`Rs ${totals.totalInvested.toLocaleString()}`} />
                <Metric title="Current Value" value={`Rs ${totals.currentValue.toLocaleString()}`} />
                <Metric title="Profit / Loss" value={`Rs ${totals.profitLoss.toLocaleString()}`} tone={totals.profitLoss >= 0 ? "good" : "bad"} />
                <Metric title="Active SIPs" value={totals.activeSips} />
            </div>

            <div className="mt-6 rounded-xl bg-white p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-black">Portfolio Search</h2>
                        <p className="mt-1 text-sm text-gray-500">Admin can leave it empty for all portfolios; investor accounts load their own portfolio by default.</p>
                    </div>
                    <div className="flex gap-3">
                        <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-500" value={investorId} onChange={(event) => setInvestorId(event.target.value)} placeholder="Investor ID" />
                        <button onClick={() => loadPortfolio(investorId.trim())} disabled={loading} className="rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                            {loading ? "Loading..." : "Load"}
                        </button>
                    </div>
                </div>
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Portfolio Valuation</h2>
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400">
                                <tr>
                                    <th className="border-b py-3">Portfolio</th>
                                    <th className="border-b py-3">Investor</th>
                                    <th className="border-b py-3">Invested</th>
                                    <th className="border-b py-3">Current</th>
                                    <th className="border-b py-3">P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolios.map((portfolio) => (
                                    <tr key={portfolio.portfolio_id} className="text-gray-700">
                                        <td className="border-b py-4 font-semibold text-black">{portfolio.portfolio_name}</td>
                                        <td className="border-b py-4">{portfolio.investor_id}</td>
                                        <td className="border-b py-4">{portfolio.total_invested}</td>
                                        <td className="border-b py-4">{portfolio.current_value}</td>
                                        <td className="border-b py-4 font-semibold text-teal-700">{portfolio.net_profit_loss}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Risk Score</h2>
                    <div className="mt-5 space-y-4">
                        {Object.entries(riskCounts).map(([risk, count]) => (
                            <div key={risk}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-gray-700">{risk}</span>
                                    <span className="text-gray-400">{count} funds</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.min(100, Number(count) * 20)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 rounded-xl bg-black p-5 text-white">
                        <p className="text-sm text-gray-300">Latest Transactions</p>
                        <p className="mt-2 text-3xl font-bold">{transactions.length}</p>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function Metric({ title, value, tone = "" }) {
    return (
        <div className="rounded-xl bg-white p-6">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className={`mt-4 text-2xl font-bold ${tone == "bad" ? "text-red-600" : tone == "good" ? "text-teal-700" : "text-black"}`}>{value}</p>
        </div>
    );
}
