"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BadgeDollarSign,
    Users,
    Wallet,
    ReceiptText,
    UserPlus,
    Repeat,
    Briefcase,
    Settings2Icon,
    LogOutIcon,
    Moon,
    Sun,
    X,
} from "lucide-react";
import { apiRequest } from "@/app/core/api";
import { ThemeContext } from "@/app/core/contexts/ThemeContext";

export default function SideBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [showSettings, setShowSettings] = useState(false);

    const mainMenu = [
        { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { title: "Register", href: "/register", icon: <UserPlus size={20} /> },
        { title: "Investor Details", href: "/investor-details", icon: <Users size={20} /> },
        { title: "Mutual Funds", href: "/funds", icon: <Wallet size={20} /> },
        { title: "Portfolio", href: "/portfolio", icon: <Briefcase size={20} /> },
        { title: "SIP", href: "/sip", icon: <Repeat size={20} /> },
        { title: "Transactions", href: "/transactions", icon: <ReceiptText size={20} /> },
    ];

    const logout = async () => {
        try {
            const tokenCookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
            const token = tokenCookie ? tokenCookie.split("=")[1] : "";
            await apiRequest("/investor/logout", {
                method: "POST",
                body: JSON.stringify({ email: "admin@gmail.com", token }),
            });
        } catch (error) {
            console.error(error);
        }
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "investor_id=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";
        router.push("/login");
    };

    return (
        <>
            <div className="w-[280px] min-h-screen shrink-0 theme-bg-sidebar border-r theme-border-sidebar flex flex-col justify-between py-8 shrink-0 hidden lg:flex">
                <div>
                    <div className="flex items-center gap-3 px-7 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <BadgeDollarSign size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold theme-text-primary tracking-tight">
                            KFin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Wings</span>
                        </h1>
                    </div>

                    <div className="px-4 mb-12">
                        <p className="text-[11px] font-semibold tracking-[0.2em] theme-text-dim uppercase mb-5 px-3">
                            Main Menu
                        </p>
                        <div className="space-y-1">
                            {mainMenu.map((item) => (
                                <HeaderItem
                                    key={item.href}
                                    icon={item.icon}
                                    title={item.title}
                                    href={item.href}
                                    active={pathname === item.href}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-7 border-t theme-border-sidebar pt-6">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-3 my-3 theme-text-dim font-medium cursor-pointer hover:theme-text-secondary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5 w-full text-left"
                    >
                        <Settings2Icon size={18} />
                        <span className="text-sm">Settings</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 my-3 theme-text-dim font-medium cursor-pointer hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-500/5 w-full text-left"
                    >
                        <LogOutIcon size={18} />
                        <span className="text-sm">Log Out</span>
                    </button>
                </div>
            </div>

            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative modal-content rounded-2xl theme-bg-card border theme-border-card p-8 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold theme-text-primary">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="theme-text-dim hover:theme-text-primary transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-semibold theme-text-muted mb-4">Appearance</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => toggleTheme("dark")}
                                        className={`rounded-xl p-5 border-2 transition-all duration-200 text-left ${
                                            theme === "dark"
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-slate-700/50 hover:border-slate-500/50"
                                        }`}
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center mb-3">
                                            <Moon size={20} className="text-indigo-400" />
                                        </div>
                                        <p className="font-semibold theme-text-primary text-sm">Dark Mode</p>
                                        <p className="text-xs theme-text-dim mt-1">Sleek dark theme</p>
                                    </button>
                                    <button
                                        onClick={() => toggleTheme("light")}
                                        className={`rounded-xl p-5 border-2 transition-all duration-200 text-left ${
                                            theme === "light"
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-slate-700/50 hover:border-slate-500/50"
                                        }`}
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                                            <Sun size={20} className="text-amber-500" />
                                        </div>
                                        <p className="font-semibold theme-text-primary text-sm">Light Mode</p>
                                        <p className="text-xs theme-text-dim mt-1">Clean bright theme</p>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t theme-border-card">
                                <p className="text-xs theme-text-dim">Theme preference is saved automatically.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function HeaderItem({ icon, title, href, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                active
                    ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-white font-semibold"
                    : "theme-text-dim hover:theme-text-secondary hover:bg-white/5"
            }`}
        >
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full" />
            )}
            <div className={`transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}>
                {icon}
            </div>
            <div className="text-sm">{title}</div>
        </Link>
    );
}
