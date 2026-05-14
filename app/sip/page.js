"use client";
import { useState } from "react";
import DashboardShell from "../components/dashboard/DashboardShell";
import { apiRequest } from "../core/api";
import { Plus, Search, Play } from "lucide-react";

const initialSip = {
    sip_id: "", investor_id: "", fund_id: "", sip_amount: "",
    sip_date: "", frequency: "", start_date: "", sip_status: "Active",
};

const initialProcess = {
    transaction_id: "", sip_id: "", investor_id: "", fund_id: "",
    transaction_amount: "", nav_used: "", units_allocated: "",
    transaction_date: "", transaction_status: "Success",
};

export default function SipPage() {
    const [sipForm, setSipForm] = useState(initialSip);
    const [processForm, setProcessForm] = useState(initialProcess);
    const [sipId, setSipId] = useState("SIP001");
    const [sip, setSip] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const resetStatus = () => { setMessage(""); setError(""); };
    const setSipValue = (name, value) => setSipForm((p) => ({ ...p, [name]: value }));
    const setProcessValue = (name, value) => setProcessForm((p) => ({ ...p, [name]: value }));

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
                    sip_date: Number(sipForm.sip_date),
                }),
            });
            setMessage(typeof result == "string" ? result : "SIP Registered Successfully");
            setSipForm(initialSip);
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    const fetchSip = async () => {
        resetStatus();
        setSip(null);
        try {
            setLoading("fetch");
            const result = await apiRequest(`/sip/${sipId}`);
            setSip(result);
            setMessage("SIP details fetched");
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
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
            setMessage(typeof result == "string" ? result : "SIP Processed Successfully");
            setProcessForm(initialProcess);
        } catch (error) { setError(error.message); }
        finally { setLoading(""); }
    };

    return (
        <DashboardShell title="SIP" subtitle="Register SIP, fetch SIP details, and process SIP installments">
            {message ? <p className="mb-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5 animate-fade-in">{message}</p> : null}
            {error ? <p className="mb-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3.5 animate-fade-in">{error}</p> : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] animate-slide-up">
                <form onSubmit={registerSip} className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><Plus size={18} className="text-indigo-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Register SIP</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.keys(initialSip).map((name) => (
                            <label key={name} className="text-sm font-medium theme-text-muted">
                                {name.replaceAll("_", " ")}
                                <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                                    type={name == "start_date" ? "date" : ["sip_amount", "sip_date"].includes(name) ? "number" : "text"}
                                    value={sipForm[name]} onChange={(e) => setSipValue(name, e.target.value)} required />
                            </label>
                        ))}
                    </div>
                    <button disabled={loading == "register"} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2">
                        <Plus size={16} />{loading == "register" ? "Registering..." : "Register SIP"}
                    </button>
                </form>

                <div className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center"><Search size={18} className="text-blue-400" /></div>
                        <h2 className="text-lg font-bold theme-text-primary">Fetch SIP Details</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <input className="flex-1 min-w-[160px] rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={sipId} onChange={(e) => setSipId(e.target.value)} placeholder="SIP ID" />
                        <button onClick={fetchSip} disabled={loading == "fetch"} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center gap-2">
                            <Search size={16} />{loading == "fetch" ? "Fetching..." : "Get SIP"}
                        </button>
                    </div>
                    {sip ? (
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {Object.entries(sip).map(([key, value]) => (
                                <div key={key} className="rounded-xl theme-bg-input border theme-border-card p-4 animate-fade-in">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider theme-text-dim">{key}</p>
                                    <p className="mt-1.5 text-sm font-semibold theme-text-primary">{String(value ?? "-")}</p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <form onSubmit={processSip} className="mt-6 rounded-2xl theme-bg-card border theme-border-card p-6 card-hover animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"><Play size={18} className="text-emerald-400" /></div>
                    <h2 className="text-lg font-bold theme-text-primary">Process SIP Installment</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {Object.keys(initialProcess).map((name) => (
                        <label key={name} className="text-sm font-medium theme-text-muted">
                            {name.replaceAll("_", " ")}
                            <input className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                                type={name.includes("date") ? "date" : ["transaction_amount", "nav_used", "units_allocated"].includes(name) ? "number" : "text"}
                                value={processForm[name]} onChange={(e) => setProcessValue(name, e.target.value)} required />
                        </label>
                    ))}
                </div>
                <button disabled={loading == "process"} className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2">
                    <Play size={16} />{loading == "process" ? "Processing..." : "Process SIP"}
                </button>
            </form>
        </DashboardShell>
    );
}
