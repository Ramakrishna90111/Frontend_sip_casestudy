"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileContext } from "@/app/core/contexts/ProfileContext";

const initialForm = {
    investor_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    pan_no: "",
    address: "",
    password: "",
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
                headers: {
                    "Content-Type": "application/json"
                },
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
        <div className="w-full max-w-3xl rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mb-8">
                <p className="text-sm font-semibold tracking-[0.25em] text-teal-500 uppercase">KFin Wings</p>
                <h1 className="mt-3 text-3xl font-bold text-black">Create Investor Account</h1>
                <p className="mt-2 text-sm text-gray-500">Signup creates your investor profile and unlocks portfolio, SIP, mutual fund, and transaction tracking.</p>
            </div>
            <form onSubmit={submitSignup}>
                <div className="grid gap-4 md:grid-cols-2">
                    {Object.keys(initialForm).map((name) => (
                        <label key={name} className="text-sm font-semibold text-gray-600">
                            {name.replaceAll("_", " ")}
                            <input
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-teal-500"
                                type={name == "date_of_birth" ? "date" : name == "password" ? "password" : "text"}
                                value={form[name]}
                                onChange={(event) => updateValue(name, event.target.value)}
                                required
                            />
                        </label>
                    ))}
                </div>
                {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
                <button disabled={loading} className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:bg-gray-400">
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-500">
                Already registered? <Link href="/login" className="font-semibold text-teal-600">Login</Link>
            </p>
        </div>
    );
}
