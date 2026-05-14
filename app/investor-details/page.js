"use client"
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";

export default function InvestorDetailPage(){
    const [investorId, setInvestorId] = useState("");
    const [investors, setInvestors] = useState([]);
    const [investor, setInvestor] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [networth, setNetworth] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState("");

    const resetStatus = () => {
        setError("");
        setMessage("");
    };

    const fetchInvestor = async () => {
        resetStatus();
        setInvestor(null);
        setInvestors([]);
        try {
            setLoading("investor");
            if (investorId.trim()) {
                const result = await apiRequest(`/investor/${investorId.trim()}`);
                setInvestor(result);
                setMessage("Investor details fetched");
            } else {
                const result = await apiRequest("/investor");
                setInvestors(Array.isArray(result) ? result : []);
                setMessage("All investor details fetched");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    const fetchHoldings = async () => {
        resetStatus();
        setHoldings([]);
        try {
            setLoading("holdings");
            const result = await apiRequest(`/investor/holdings/${investorId}`);
            setHoldings(Array.isArray(result?.holdings) ? result.holdings : []);
            setMessage("Investor holdings fetched");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    const fetchNetworth = async () => {
        resetStatus();
        setNetworth(null);
        try {
            setLoading("networth");
            const result = await apiRequest(`/investor/networth/${investorId}`);
            setNetworth(result);
            setMessage("Investor networth fetched");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    return (
        <DashboardShell title="Investor Details" subtitle="Fetch investor profile, holdings, and networth by investor id">
            <div className="rounded-xl bg-white p-6">
                <div className="flex flex-wrap items-end gap-3">
                    <label className="text-sm font-semibold text-gray-600">
                        Investor ID
                        <input className="mt-2 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500" value={investorId} onChange={(event)=>setInvestorId(event.target.value)} placeholder="Leave empty for all investors" />
                    </label>
                    <button onClick={fetchInvestor} disabled={loading == "investor"} className="rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">{investorId.trim() ? "Search Investor" : "Get All Investors"}</button>
                    <button onClick={fetchHoldings} disabled={loading == "holdings"} className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white disabled:bg-gray-400">Get Holdings</button>
                    <button onClick={fetchNetworth} disabled={loading == "networth"} className="rounded-lg border border-gray-200 px-6 py-3 font-semibold text-black disabled:text-gray-400">Get Networth</button>
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-teal-600">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
                {investor ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {Object.entries(investor).map(([key, value]) => (
                            <div key={key} className="rounded-lg border border-gray-100 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{key}</p>
                                <p className="mt-2 text-sm font-semibold text-black">{String(value ?? "-")}</p>
                            </div>
                        ))}
                    </div>
                ) : null}
                {investors.length ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400">
                                <tr>
                                    <th className="border-b py-3">Investor ID</th>
                                    <th className="border-b py-3">Name</th>
                                    <th className="border-b py-3">PAN</th>
                                    <th className="border-b py-3">Email</th>
                                    <th className="border-b py-3">DOB</th>
                                    <th className="border-b py-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {investors.map((item) => (
                                    <tr key={item.investor_id} className="text-gray-700">
                                        <td className="border-b py-4 font-semibold text-black">{item.investor_id}</td>
                                        <td className="border-b py-4">{[item.first_name, item.last_name].filter(Boolean).join(" ")}</td>
                                        <td className="border-b py-4">{item.pan_no}</td>
                                        <td className="border-b py-4">{item.email}</td>
                                        <td className="border-b py-4">{item.date_of_birth}</td>
                                        <td className="border-b py-4">{item.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
                {networth ? (
                    <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Networth</p>
                        <p className="mt-2 text-3xl font-bold text-black">{String(networth.networth ?? 0)}</p>
                    </div>
                ) : null}
                {holdings.length ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400">
                                <tr>
                                    <th className="border-b py-3">Fund Name</th>
                                    <th className="border-b py-3">Units Held</th>
                                    <th className="border-b py-3">NAV</th>
                                    <th className="border-b py-3">Current Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((holding, index) => (
                                    <tr key={`${holding.fund_name}-${index}`} className="text-gray-700">
                                        <td className="border-b py-4 font-semibold text-black">{holding.fund_name}</td>
                                        <td className="border-b py-4">{holding.units_held}</td>
                                        <td className="border-b py-4">{holding.nav_value}</td>
                                        <td className="border-b py-4 font-semibold text-black">{holding.current_value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
        </DashboardShell>
    );
}
