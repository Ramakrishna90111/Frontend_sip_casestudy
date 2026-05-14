"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";

const initialSip = {
    sip_id: "",
    investor_id: "",
    fund_id: "",
    sip_amount: "",
    sip_date: "",
    frequency: "",
    start_date: "",
    sip_status: "Active",
};

const initialProcess = {
    transaction_id: "",
    sip_id: "",
    investor_id: "",
    fund_id: "",
    transaction_amount: "",
    nav_used: "",
    units_allocated: "",
    transaction_date: "",
    transaction_status: "Success",
};

export default function SipPage() {
    const [sipForm, setSipForm] = useState(initialSip);
    const [processForm, setProcessForm] = useState(initialProcess);
    const [sipId, setSipId] = useState("SIP001");
    const [sip, setSip] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const resetStatus = () => {
        setMessage("");
        setError("");
    };

    const setSipValue = (name, value) => {
        setSipForm((previous) => ({ ...previous, [name]: value }));
    };

    const setProcessValue = (name, value) => {
        setProcessForm((previous) => ({ ...previous, [name]: value }));
    };

    const registerSip = async (event) => {
        event.preventDefault();
        resetStatus();
        try {
            setLoading("register");
            const result = await apiRequest("/sip", {
                method: "POST",
                body: JSON.stringify({
                    ...sipForm,
                    sip_amount: Number(sipForm.sip_amount),
                }),
            });
            setMessage(typeof result == "string" ? result : "SIP Registered");
            setSipForm(initialSip);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    const fetchSip = async () => {
        resetStatus();
        setSip(null);
        try {
            setLoading("fetch");
            const result = await apiRequest(`/sip/${sipId}`);
            setSip(result);
            setMessage("SIP details fetched");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    const processSip = async (event) => {
        event.preventDefault();
        resetStatus();
        try {
            setLoading("process");
            const result = await apiRequest(`/sip/process/${processForm.sip_id}`, {
                method: "POST",
                body: JSON.stringify({
                    ...processForm,
                    transaction_amount: Number(processForm.transaction_amount),
                    nav_used: Number(processForm.nav_used),
                    units_allocated: Number(processForm.units_allocated),
                }),
            });
            setMessage(typeof result == "string" ? result : "SIP Processed");
            setProcessForm(initialProcess);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading("");
        }
    };

    return (
        <DashboardShell title="SIP" subtitle="Register SIP, fetch SIP details, and process SIP installments">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <form onSubmit={registerSip} className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Register SIP</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {Object.keys(initialSip).map((name) => (
                            <label key={name} className="text-sm font-semibold text-gray-600">
                                {name.replaceAll("_", " ")}
                                <input
                                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500"
                                    type={name == "start_date" ? "date" : ["sip_amount", "sip_date"].includes(name) ? "number" : "text"}
                                    value={sipForm[name]}
                                    onChange={(event) => setSipValue(name, event.target.value)}
                                    required
                                />
                            </label>
                        ))}
                    </div>
                    <button disabled={loading == "register"} className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                        {loading == "register" ? "Registering..." : "Register SIP"}
                    </button>
                </form>

                <div className="rounded-xl bg-white p-6">
                    <h2 className="text-xl font-bold text-black">Fetch SIP</h2>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500" value={sipId} onChange={(event) => setSipId(event.target.value)} placeholder="SIP ID" />
                        <button onClick={fetchSip} disabled={loading == "fetch"} className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                            {loading == "fetch" ? "Fetching..." : "Get SIP"}
                        </button>
                    </div>
                    {sip ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {Object.entries(sip).map(([key, value]) => (
                                <div key={key} className="rounded-lg border border-gray-100 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{key}</p>
                                    <p className="mt-2 text-sm font-semibold text-black">{String(value ?? "-")}</p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <form onSubmit={processSip} className="mt-6 rounded-xl bg-white p-6">
                <h2 className="text-xl font-bold text-black">Process SIP Installment</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {Object.keys(initialProcess).map((name) => (
                        <label key={name} className="text-sm font-semibold text-gray-600">
                            {name.replaceAll("_", " ")}
                            <input
                                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500"
                                type={name.includes("date") ? "date" : ["transaction_amount", "nav_used", "units_allocated"].includes(name) ? "number" : "text"}
                                value={processForm[name]}
                                onChange={(event) => setProcessValue(name, event.target.value)}
                                required
                            />
                        </label>
                    ))}
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-teal-600">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
                <button disabled={loading == "process"} className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                    {loading == "process" ? "Processing..." : "Process SIP"}
                </button>
            </form>
        </DashboardShell>
    );
}
