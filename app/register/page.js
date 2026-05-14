"use client";
import { useState } from "react";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import InputField from "@/app/components/InputField";
import { apiRequest } from "@/app/core/api";

const initialForm = {
    investor_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    pan_no: "",
    address: "",
};

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateValue = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const submitInvestor = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        try {
            setLoading(true);
            const result = await apiRequest("/investor/register", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setMessage(result?.message || "Investor registered");
            setForm(initialForm);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardShell title="Register Investor" subtitle="Add investor details exactly as required by the SIP portfolio database">
            <form onSubmit={submitInvestor} className="rounded-xl bg-white p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(initialForm).map((name) => (
                        <label key={name} className="text-sm font-semibold text-gray-600">
                            {name.replaceAll("_", " ")}
                            <InputField
                                props={{
                                    name,
                                    value: form[name],
                                    placeholder: name.replaceAll("_", " "),
                                    type: name == "date_of_birth" ? "date" : "text",
                                    required: true,
                                    inputValue: (value) => updateValue(name, value),
                                    className: "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500",
                                }}
                            />
                        </label>
                    ))}
                </div>
                {message ? <p className="mt-4 text-sm font-semibold text-teal-600">{message}</p> : null}
                {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
                <button className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400" disabled={loading}>
                    {loading ? "Registering..." : "Register Investor"}
                </button>
            </form>
        </DashboardShell>
    );
}
