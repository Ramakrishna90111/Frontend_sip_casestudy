"use client";
import SideBar from "./sideBar";

export default function DashboardShell({ children, title, subtitle }) {
    return (
        <main className="min-h-screen theme-bg-page bg-grid">
            <div className="mx-auto flex min-h-screen max-w-[1440px]">
                <SideBar />
                <section className="flex-1 overflow-auto p-6 lg:p-8 xl:p-10 animate-fade-in">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="animate-slide-up">
                            <h1 className="text-2xl lg:text-3xl font-bold theme-text-primary tracking-tight">{title}</h1>
                            {subtitle ? <p className="mt-2 text-sm theme-text-muted max-w-2xl">{subtitle}</p> : null}
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/25 shrink-0">
                            A
                        </div>
                    </div>
                    {children}
                </section>
            </div>
        </main>
    );
}
