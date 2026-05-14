"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/app/components/InputField";
import { ProfileContext } from "@/app/core/contexts/ProfileContext";
import { BadgeDollarSign } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { storeDetails } = useContext(ProfileContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/investor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || "Login failed");
        return;
      }
      storeDetails(email, password, result.token, result.investor_id || "", result.role || "");
      router.push("/dashboard");
    } catch (error) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full rounded-2xl theme-bg-card border theme-border-card p-8 shadow-2xl" style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <BadgeDollarSign size={28} className="text-white" />
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">KFin Wings</p>
          <h1 className="mt-3 text-3xl font-bold theme-text-primary tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm theme-text-muted">Track SIPs, mutual funds, portfolio value, and investor performance.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium theme-text-muted mb-2">Email</label>
            <InputField props={{ placeholder: "Enter your email", type: "text", value: email, inputValue: setEmail }} />
          </div>
          <div>
            <label className="block text-sm font-medium theme-text-muted mb-2">Password</label>
            <InputField props={{ placeholder: "Enter your password", type: "password", value: password, inputValue: setPassword }} />
          </div>
          {error ? <p className="text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p> : null}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
          <p className="text-center text-sm theme-text-dim">
            New investor?{" "}
            <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Create account</Link>
          </p>
        </div>
      </div>
  );
}
