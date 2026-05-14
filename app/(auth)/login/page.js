"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/app/components/InputField";
import { ProfileContext } from "@/app/core/contexts/ProfileContext";

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
        headers: {
          "Content-Type": "application/json"
        },
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
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.25em] text-teal-500 uppercase">KFin Wings</p>
          <h1 className="mt-3 text-3xl font-bold text-black">Login</h1>
          <p className="mt-2 text-sm text-gray-500">Track SIPs, mutual funds, portfolio value, and investor performance.</p>
        </div>
        <div className="space-y-4">
          <InputField
            props={{
              placeholder: "Enter email",
              type: "text",
              value: email,
              inputValue: setEmail,
            }}
          />
          <InputField
            props={{
              placeholder: "Enter password",
              type: "password",
              value: password,
              inputValue: setPassword,
            }}
          />
          {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-gray-500">
            New investor? <Link href="/signup" className="font-semibold text-teal-600">Create account</Link>
          </p>
        </div>
      </div>
  );
}
