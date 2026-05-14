"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { Activity, IndianRupee, PieChart, ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { apiRequest } from "../core/api";

export default function Dashboard() {
    const [investors, setInvestors] = useState([]);
    const [funds, setFunds] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [sips, setSips] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [investorResult, fundResult, portfolioResult, sipResult, transactionResult] = await Promise.all([
                    apiRequest("/investor"),
                    apiRequest("/fund"),
                    apiRequest("/portfolio"),
                    apiRequest("/sip"),
                    apiRequest("/sip/transactions"),
                ]);
                setInvestors(Array.isArray(investorResult) ? investorResult : []);
                setFunds(Array.isArray(fundResult) ? fundResult : []);
                setPortfolios(Array.isArray(portfolioResult) ? portfolioResult : []);
                setSips(Array.isArray(sipResult) ? sipResult : []);
                setTransactions(Array.isArray(transactionResult) ? transactionResult : []);
            } catch (error) {
                setError(error.message);
            }
        }
        loadDashboard();
    }, []);

    const analytics = useMemo(() => {
        const totalInvested = portfolios.reduce((sum, item) => sum + Number(item.total_invested || 0), 0);
        const currentValue = portfolios.reduce((sum, item) => sum + Number(item.current_value || 0), 0);
        const profitLoss = portfolios.reduce((sum, item) => sum + Number(item.net_profit_loss || 0), 0);
        const activeSipCount = sips.filter((sip) => sip.sip_status == "Active").length;
        const successTxn = transactions.filter((txn) => txn.transaction_status == "Success").length;
        const successRate = transactions.length ? Math.round((successTxn / transactions.length) * 100) : 0;
        return { totalInvested, currentValue, profitLoss, activeSipCount, successRate };
    }, [portfolios, sips, transactions]);

    const riskData = useMemo(() => {
        const groups = funds.reduce((items, fund) => {
            const risk = fund.risk_level || "Unknown";
            items[risk] = (items[risk] || 0) + 1;
            return items;
        }, {});
        return Object.entries(groups);
    }, [funds]);

    const valueBars = portfolios.slice(0, 5).map((portfolio) => ({
        label: portfolio.portfolio_name,
        value: Number(portfolio.current_value || 0),
    }));
    const maxValue = Math.max(...valueBars.map((item) => item.value), 1);

    return (
        <DashboardShell title="Portfolio Dashboard" subtitle="Professional SIP tracking, portfolio valuation, mutual fund risk, and investor analytics">
            {error ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p> : null}
            <div className="grid gap-5 md:grid-cols-4">
                <SummaryCard title="Portfolio Value" value={`Rs ${analytics.currentValue.toLocaleString()}`} icon={<IndianRupee size={22} />} />
                <SummaryCard title="Total Invested" value={`Rs ${analytics.totalInvested.toLocaleString()}`} icon={<Wallet size={22} />} />
                <SummaryCard title="Net Gain" value={`Rs ${analytics.profitLoss.toLocaleString()}`} icon={<TrendingUp size={22} />} />
                <SummaryCard title="Active SIPs" value={analytics.activeSipCount} icon={<Activity size={22} />} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-xl bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-black">Portfolio Valuation Graph</h2>
                            <p className="mt-1 text-sm text-gray-500">Top portfolios by current value</p>
                        </div>
                        <PieChart size={22} className="text-teal-500" />
                    </div>
                    <div className="mt-6 space-y-5">
                        {valueBars.map((item) => (
                            <div key={item.label}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-gray-700">{item.label}</span>
                                    <span className="text-gray-500">Rs {item.value.toLocaleString()}</span>
                                </div>
                                <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${(item.value / maxValue) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl bg-black p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-teal-300">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Risk Score</h2>
                            <p className="mt-1 text-sm text-gray-300">Mutual fund exposure by risk level</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        {riskData.map(([risk, count]) => (
                            <div key={risk}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span>{risk}</span>
                                    <span className="text-gray-300">{count}</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full rounded-full bg-teal-300" style={{ width: `${Math.min(100, Number(count) * 22)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <MiniStat label="Investors" value={investors.length} icon={<Users size={18} />} />
                        <MiniStat label="Txn Success" value={`${analytics.successRate}%`} icon={<TrendingUp size={18} />} />
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Insight title="Investor Holdings" value={`${investors.length} investors`} text="Investor records, holdings, and networth are available from the Investor Details page." />
                <Insight title="Mutual Funds" value={`${funds.length} schemes`} text="Scheme NAV, category, AMC, and risk score are managed in Mutual Funds." />
                <Insight title="SIP Tracker" value={`${sips.length} SIPs`} text="Register SIPs, fetch SIP details, and process installments from the SIP workflow." />
            </div>
        </DashboardShell>
    );
}

function SummaryCard({ title, value, icon }) {
    return (
        <div className="rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">{title}</p>
                <div className="text-teal-500">{icon}</div>
            </div>
            <p className="mt-5 text-2xl font-bold text-black">{value}</p>
        </div>
    );
}

function MiniStat({ label, value, icon }) {
    return (
        <div className="rounded-xl bg-white/10 p-4">
            <div className="text-teal-300">{icon}</div>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-gray-300">{label}</p>
        </div>
    );
}

function Insight({ title, value, text }) {
    return (
        <div className="rounded-xl bg-white p-6">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="mt-3 text-2xl font-bold text-black">{value}</p>
            <p className="mt-3 text-sm leading-6 text-gray-500">{text}</p>
        </div>
    );
}
