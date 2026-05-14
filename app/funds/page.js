"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";

const initialFund = {
    fund_id: "",
    fund_name: "",
    amc_name: "",
    fund_type: "",
    category: "",
    nav_value: "",
    nav_date: "",
    risk_level: "",
};

export default function FundsPage() {
    const [funds, setFunds] = useState([]);
    const [fundForm, setFundForm] = useState(initialFund);
    const [navForm, setNavForm] = useState({ fund_id: "", nav_value: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const setFundValue = (name, value) => {
        setFundForm((previous) => ({ ...previous, [name]: value }));
    };

    const resetStatus = () => {
        setError("");
        setMessage("");
    };

    const fetchFunds = async () => {
        resetStatus();
        try {
            setLoading("list");
            const result = await apiRequest("/fund");
            setFunds(Array.isArray(result) ? result : []);
            setMessage("Funds fetched");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    const createFund = async (event) => {
        event.preventDefault();
        resetStatus();
        try {
            setLoading("create");
            const result = await apiRequest("/fund", {
                method: "POST",
                body: JSON.stringify({
                    ...fundForm,
                    nav_value: Number(fundForm.nav_value),
                }),
            });
            setMessage(typeof result == "string" ? result : "Fund Added");
            setFundForm(initialFund);
            await fetchFunds();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
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
            setMessage(typeof result == "string" ? result : "NAV Updated");
            setNavForm({ fund_id: "", nav_value: "" });
            await fetchFunds();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    return (
        <DashboardShell title="Mutual Funds" subtitle="Create mutual funds, fetch schemes, and update NAV values">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={createFund} className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Create Mutual Fund</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {Object.keys(initialFund).map((name) => (
                            <label key={name} className="text-sm font-semibold text-gray-600">
                                {name.replaceAll("_", " ")}
                                <input
                                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500"
                                    type={name == "nav_date" ? "date" : name == "nav_value" ? "number" : "text"}
                                    value={fundForm[name]}
                                    onChange={(event) => setFundValue(name, event.target.value)}
                                    required
                                />
                            </label>
                        ))}
                    </div>
                    <button disabled={loading == "create"} className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                        {loading == "create" ? "Adding..." : "Add Mutual Fund"}
                    </button>
                </form>

                <form onSubmit={updateNav} className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Update NAV</h2>
                    <div className="mt-5 space-y-4">
                        <label className="block text-sm font-semibold text-gray-600">
                            Fund ID
                            <input className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500" value={navForm.fund_id} onChange={(event) => setNavForm((previous) => ({ ...previous, fund_id: event.target.value }))} required />
                        </label>
                        <label className="block text-sm font-semibold text-gray-600">
                            NAV Value
                            <input className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500" type="number" value={navForm.nav_value} onChange={(event) => setNavForm((previous) => ({ ...previous, nav_value: event.target.value }))} required />
                        </label>
                    </div>
                    <button disabled={loading == "nav"} className="mt-6 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                        {loading == "nav" ? "Updating..." : "Update NAV"}
                    </button>
                </form>
            </div>

            <div className="mt-6 rounded-xl bg-white p-6">
                <button onClick={fetchFunds} disabled={loading == "list"} className="rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                    {loading == "list" ? "Loading..." : "Get Mutual Funds"}
                </button>
                {message ? <p className="mt-4 text-sm font-semibold text-teal-600">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-400">
                            <tr>
                                <th className="border-b py-3">Fund ID</th>
                                <th className="border-b py-3">Fund Name</th>
                                <th className="border-b py-3">AMC</th>
                                <th className="border-b py-3">Category</th>
                                <th className="border-b py-3">NAV</th>
                                <th className="border-b py-3">NAV Date</th>
                                <th className="border-b py-3">Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funds.map((fund) => (
                                <tr key={fund.fund_id} className="text-gray-700">
                                    <td className="border-b py-4 font-semibold text-black">{fund.fund_id}</td>
                                    <td className="border-b py-4">{fund.fund_name}</td>
                                    <td className="border-b py-4">{fund.amc_name}</td>
                                    <td className="border-b py-4">{fund.category}</td>
                                    <td className="border-b py-4">{fund.nav_value}</td>
                                    <td className="border-b py-4">{fund.nav_date}</td>
                                    <td className="border-b py-4">{fund.risk_level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardShell>
    );
}
