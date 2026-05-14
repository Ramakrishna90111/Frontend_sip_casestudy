"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileContext } from "@/app/core/contexts/ProfileContext";
import { BadgeDollarSign } from "lucide-react";

const initialForm = {
    investor_id: "", first_name: "", last_name: "", email: "",
    phone: "", date_of_birth: "", pan_no: "", address: "", password: "",
};

export default function SignupPage() {
    const router = useRouter();
    const { storeDetails } = useContext(ProfileContext);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateValue = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const submitSignup = async (event) => {
        event.preventDefault();
        setError("");
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/api/investor/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const result = await response.json();
            if (!response.ok) {
                setError(result?.error || "Signup failed");
                return;
            }
            storeDetails(form.email, form.password, result.token, result.investor_id, result.role);
            router.push("/portfolio");
        } catch (error) {
            setError("Backend connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl rounded-2xl theme-bg-card border theme-border-card p-8 shadow-2xl" style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <BadgeDollarSign size={28} className="text-white" />
                </div>
                <p className="text-sm font-semibold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">KFin Wings</p>
                <h1 className="mt-3 text-3xl font-bold theme-text-primary tracking-tight">Create Account</h1>
                <p className="mt-2 text-sm theme-text-muted">Signup creates your investor profile and unlocks portfolio, SIP, mutual fund, and transaction tracking.</p>
            </div>
            <form onSubmit={submitSignup}>
                <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(initialForm).map((name) => (
                        <label key={name} className="text-sm font-medium theme-text-muted">
                            {name.replaceAll("_", " ")}
                            <input
                                className="mt-2 w-full rounded-xl border theme-border-card theme-bg-input px-4 py-3.5 text-sm theme-text-primary placeholder-theme-text-dim outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-input-focus focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
                                type={name == "date_of_birth" ? "date" : name == "password" ? "password" : "text"}
                                value={form[name]}
                                onChange={(event) => updateValue(name, event.target.value)}
                                required
                            />
                        </label>
                    ))}
                </div>
                {error ? <p className="mt-4 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
                <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
            <p className="mt-5 text-center text-sm theme-text-dim">
                Already registered?{" "}
                <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Login</Link>
            </p>
        </div>
    );
}
