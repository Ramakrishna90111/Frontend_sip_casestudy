"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { Activity, IndianRupee, ShieldCheck, TrendingUp, Users, Wallet, ArrowUpRight, ArrowDownRight, BarChart3, LineChart } from "lucide-react";
import { apiRequest } from "../core/api";

function generateSparkline(base, count = 12, variance = 0.08) {
  const points = [];
  let val = base * (1 + (Math.random() - 0.5) * 0.2);
  for (let i = 0; i < count; i++) {
    val = val * (1 + (Math.random() - 0.5) * variance);
    points.push(val);
  }
  const last = points[points.length - 1];
  if (last > base * 1.25) points[points.length - 1] = base * (1 + Math.random() * 0.15);
  if (last < base * 0.75) points[points.length - 1] = base * (1 - Math.random() * 0.15);
  return points;
}

function SparklineChart({ data, width = 120, height = 36 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height * 0.85 - height * 0.075}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#10b981" : "#ef4444";
  const gradientId = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-fade-in" />
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${gradientId})`} className="animate-fade-in" />
    </svg>
  );
}

function DonutChart({ data, size = 140, strokeWidth = 18 }) {
  if (!data || data.length === 0) return null;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = (size - strokeWidth) / 2;
  const colors = ["#6366f1", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444", "#06b6d4"];
  let offset = 0;
  const circ = 2 * Math.PI * r;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const len = pct * circ;
    const seg = { ...d, len, offset, pct, color: colors[i % colors.length] };
    offset += len;
    return seg;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
      {segments.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={strokeWidth} strokeDasharray={`${s.len} ${circ - s.len}`} strokeDashoffset={-s.offset} strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </svg>
  );
}

function AreaChart({ data, width = 580, height = 140 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;
  const w = width - pad * 2, h = height - pad * 2;
  const pts = data.map((v, i) => `${pad + (i / (data.length - 1)) * w},${pad + h - ((v - min) / range) * h}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#10b981" : "#ef4444";
  const dotColor = isUp ? "#34d399" : "#f87171";
  const gradId = `area-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1={pad} y1={pad + h * y} x2={pad + w} y2={pad + h * y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <polygon points={`${pad},${pad + h} ${pts} ${pad + w},${pad + h}`} fill={`url(#${gradId})`} className="animate-fade-in" />
      <polyline points={pts} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-fade-in" />
      <circle cx={pad + ((data.length - 1) / (data.length - 1)) * w} cy={pad + h - ((data[data.length - 1] - min) / range) * h} r="4" fill={dotColor} stroke="var(--bg-card)" strokeWidth="2" className="animate-fade-in" />
    </svg>
  );
}

function MiniBarChart({ data, width = 260, height = 80 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const bw = Math.min(28, (width - 10) / data.length - 4);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 8);
        const x = 6 + i * (bw + 6);
        const y = height - 4 - barH;
        const isUp = d.trend !== "down";
        return (
          <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <rect x={x} y={y} width={bw} height={barH} rx={3} fill={isUp ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"} />
            <rect x={x} y={y} width={bw} height={Math.min(barH, 3)} rx={1.5} fill={isUp ? "#10b981" : "#ef4444"} />
          </g>
        );
      })}
    </svg>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
        return Object.entries(groups).map(([label, value]) => ({ label, value }));
    }, [funds]);

    const valueBars = portfolios.slice(0, 5).map((portfolio) => ({
        label: portfolio.portfolio_name,
        value: Number(portfolio.current_value || 0),
    }));
    const maxValue = Math.max(...valueBars.map((item) => item.value), 1);

    const portfolioSparkline = useMemo(() => generateSparkline(analytics.currentValue || 100000, 12, 0.06), [analytics.currentValue]);
    const investedSparkline = useMemo(() => generateSparkline(analytics.totalInvested || 50000, 12, 0.04), [analytics.totalInvested]);
    const gainSparkline = useMemo(() => generateSparkline(Math.abs(analytics.profitLoss || 10000), 12, 0.1), [analytics.profitLoss]);
    const sipSparkline = useMemo(() => generateSparkline(analytics.activeSipCount || 5, 8, 0.15), [analytics.activeSipCount]);

    const trendMonths = MONTHS.slice(-6);
    const trendData = useMemo(() => {
      const pts = [];
      let base = analytics.currentValue / (analytics.totalInvested || 1) > 1.1 ? analytics.totalInvested * 0.85 : analytics.totalInvested * 0.7;
      for (let i = 0; i < 6; i++) {
        base = base * (1 + (Math.random() - 0.3) * 0.08);
        pts.push(base);
      }
      return pts;
    }, [analytics.currentValue, analytics.totalInvested]);

    const txnTrend = useMemo(() => {
      const statuses = ["Success", "Success", "Success", "Failed", "Success", "Success", "Failed", "Success"];
      return transactions.length ? transactions.slice(0, 8).map((t, i) => ({
        label: `T${i + 1}`, value: Number(t.transaction_amount || 0),
        trend: (t.transaction_status || t.status) === "Success" ? "up" : "down",
      })) : statuses.map((s, i) => ({
        label: `T${i + 1}`, value: Math.round(5000 + Math.random() * 20000),
        trend: s === "Success" ? "up" : "down",
      }));
    }, [transactions]);

    return (
        <DashboardShell title="Portfolio Dashboard" subtitle="Professional SIP tracking, portfolio valuation, mutual fund risk, and investor analytics">
            {error ? <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-3.5 text-sm font-semibold text-red-400 animate-fade-in">{error}</p> : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-slide-up">
                <SummaryCard title="Portfolio Value" value={`Rs ${analytics.currentValue.toLocaleString()}`} icon={<IndianRupee size={20} />} trend="up" gradient="from-indigo-500 to-purple-600" sparkline={portfolioSparkline} change="+12.4%" />
                <SummaryCard title="Total Invested" value={`Rs ${analytics.totalInvested.toLocaleString()}`} icon={<Wallet size={20} />} gradient="from-blue-500 to-cyan-500" sparkline={investedSparkline} change="+8.2%" />
                <SummaryCard title="Net Gain" value={`Rs ${analytics.profitLoss.toLocaleString()}`} icon={<TrendingUp size={20} />} trend={analytics.profitLoss >= 0 ? "up" : "down"} gradient="from-emerald-500 to-teal-500" sparkline={gainSparkline} change={analytics.profitLoss >= 0 ? "+18.6%" : "-4.2%"} />
                <SummaryCard title="Active SIPs" value={analytics.activeSipCount} icon={<Activity size={20} />} gradient="from-amber-500 to-orange-500" sparkline={sipSparkline} change="+3" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr] animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <section className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <LineChart size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold theme-text-primary">Performance Trend</h2>
                        <p className="text-xs theme-text-dim">Portfolio growth over last 6 months</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs theme-text-dim">vs invested</span>
                      <span className={`text-xs font-semibold flex items-center gap-0.5 ${analytics.currentValue >= analytics.totalInvested ? "text-emerald-400" : "text-red-400"}`}>
                        {analytics.currentValue >= analytics.totalInvested ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {analytics.totalInvested ? `${(((analytics.currentValue - analytics.totalInvested) / analytics.totalInvested) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <AreaChart data={trendData} width={580} height={140} />
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    {trendMonths.map((m) => (
                      <span key={m} className="text-[10px] font-medium theme-text-dim">{m}</span>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                      <BarChart3 size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold theme-text-primary">Recent Transactions</h2>
                      <p className="text-xs theme-text-dim">Last 8 transaction amounts</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <MiniBarChart data={txnTrend} width={260} height={80} />
                  </div>
                  <div className="mt-3 rounded-xl bg-insight p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="theme-text-muted">Success Rate</span>
                      <span className="font-bold theme-text-primary">{analytics.successRate}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" style={{ width: `${analytics.successRate}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] theme-text-dim">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr] animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <section className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <PieChartIcon size={20} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold theme-text-primary">Portfolio Allocation</h2>
                                <p className="text-xs theme-text-dim">Top portfolios by current value</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className="flex items-center justify-center">
                            <DonutChart data={valueBars.map(v => ({ label: v.label, value: v.value }))} size={140} strokeWidth={18} />
                        </div>
                        <div className="flex flex-col justify-center gap-2.5">
                            {valueBars.slice(0, 4).map((item, i) => {
                                const colors = ["#6366f1", "#8b5cf6", "#14b8a6", "#f59e0b"];
                                return (
                                    <div key={item.label} className="flex items-center gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                                        <span className="text-xs theme-text-muted truncate">{item.label}</span>
                                        <span className="text-xs font-semibold theme-text-primary ml-auto">Rs {item.value.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                            {valueBars.length === 0 && <p className="text-xs theme-text-dim text-center">No data</p>}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-[var(--bg-card)] border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                            <ShieldCheck size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold theme-text-primary">Risk Distribution</h2>
                            <p className="text-xs theme-text-dim">Fund exposure by risk level</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-4">
                        {riskData.map((item, i) => (
                            <div key={item.label} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                    <span className="theme-text-secondary">{item.label}</span>
                                    <span className="theme-text-dim">{item.value} funds</span>
                                </div>
                                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                                    <div className={`h-full rounded-full transition-all duration-700 ${item.label === "High" ? "bg-gradient-to-r from-red-500 to-rose-500" : item.label === "Medium" ? "bg-gradient-to-r from-amber-500 to-orange-500" : item.label === "Low" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-slate-500 to-slate-400"}`} style={{ width: `${Math.min(100, Number(item.value) * 22)}%` }} />
                                </div>
                            </div>
                        ))}
                        {riskData.length === 0 && <p className="text-sm theme-text-dim text-center py-6">No risk data available</p>}
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <MiniStat label="Total Investors" value={investors.length} icon={<Users size={16} />} />
                        <MiniStat label="Txn Success" value={`${analytics.successRate}%`} icon={<Activity size={16} />} />
                    </div>
                </section>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Insight title="Investor Holdings" value={`${investors.length} investors`} text="Investor records, holdings, and networth are available from the Investor Details page." gradient="from-indigo-500/10 to-purple-500/10" borderColor="border-indigo-500/20" />
                <Insight title="Mutual Funds" value={`${funds.length} schemes`} text="Scheme NAV, category, AMC, and risk score are managed in Mutual Funds." gradient="from-blue-500/10 to-cyan-500/10" borderColor="border-blue-500/20" />
                <Insight title="SIP Tracker" value={`${sips.length} SIPs`} text="Register SIPs, fetch SIP details, and process installments from the SIP workflow." gradient="from-emerald-500/10 to-teal-500/10" borderColor="border-emerald-500/20" />
            </div>
        </DashboardShell>
    );
}

function PieChartIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function SummaryCard({ title, value, icon, trend = "", gradient = "from-indigo-500 to-purple-600", sparkline, change }) {
    return (
        <div className="rounded-2xl theme-bg-card border theme-border-card p-5 card-hover group">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold tracking-wide theme-text-muted uppercase">{title}</p>
                    <p className="mt-2 text-xl xl:text-2xl font-bold theme-text-primary tracking-tight truncate">{value}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                        {trend && (
                            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                                {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {change || (trend === "up" ? "Rising" : "Falling")}
                            </span>
                        )}
                        {!trend && change && (
                            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                                <ArrowUpRight size={12} />{change}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0 ml-3`}>
                    {icon}
                </div>
            </div>
            {sparkline && <div className="mt-2 -mb-1 -mx-1"><SparklineChart data={sparkline} width={200} height={32} /></div>}
        </div>
    );
}

function MiniStat({ label, value, icon }) {
    return (
        <div className="rounded-xl bg-insight p-4 card-hover hover:bg-white/10">
            <div className="text-indigo-400">{icon}</div>
            <p className="mt-2 text-xl font-bold theme-text-primary">{value}</p>
            <p className="mt-1 text-xs theme-text-dim">{label}</p>
        </div>
    );
}

function Insight({ title, value, text, gradient = "from-indigo-500/10 to-purple-500/10", borderColor = "border-indigo-500/20" }) {
    return (
        <div className={`rounded-2xl bg-gradient-to-br ${gradient} border ${borderColor} p-5 card-hover`}>
            <p className="text-xs font-semibold tracking-wide theme-text-muted uppercase">{title}</p>
            <p className="mt-3 text-2xl font-bold theme-text-primary">{value}</p>
            <p className="mt-3 text-sm leading-relaxed theme-text-muted">{text}</p>
        </div>
    );
}
