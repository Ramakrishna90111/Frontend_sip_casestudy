"use client";
import { useState } from "react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import InputField from "@/app/components/InputField";
import { apiRequest } from "@/app/core/api";
import { UserPlus } from "lucide-react";

const initialForm = {
    investor_id: "", first_name: "", last_name: "", email: "",
    phone: "", date_of_birth: "", pan_no: "", address: "",
};

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateValue = (name, value) => setForm((p) => ({ ...p, [name]: value }));

    const submitInvestor = async (event) => {
        event.preventDefault();
        setMessage(""); setError("");
        try {
            setLoading(true);
            const result = await apiRequest("/investor/register", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setMessage(result?.message || "Investor registered");
            setForm(initialForm);
        } catch (error) { setError(error.message); }
        finally { setLoading(false); }
    };

    return (
        <DashboardShell title="Register Investor" subtitle="Add investor details exactly as required by the SIP portfolio database">
            <form onSubmit={submitInvestor} className="rounded-2xl theme-bg-card border theme-border-card p-6 card-hover animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"><UserPlus size={18} className="text-indigo-400" /></div>
                    <h2 className="text-lg font-bold theme-text-primary">New Investor Registration</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(initialForm).map((name) => (
                        <label key={name} className="text-sm font-medium theme-text-muted">
                            {name.replaceAll("_", " ")}
                            <InputField props={{
                                name, value: form[name], placeholder: name.replaceAll("_", " "),
                                type: name == "date_of_birth" ? "date" : "text", required: true,
                                inputValue: (v) => updateValue(name, v),
                                className: "mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3.5 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]",
                            }} />
                        </label>
                    ))}
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
                <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                    {loading ? "Registering..." : "Register Investor"}
                </button>
            </form>
        </DashboardShell>
    );
}
