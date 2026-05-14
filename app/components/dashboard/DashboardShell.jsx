"use client";
import SideBar from "./sideBar";

export default function DashboardShell({ children, title, subtitle }) {
    return (
        <main className="min-h-screen bg-[#d7d7df] p-6">
            <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl overflow-hidden rounded-[28px] bg-[#f7f7fa] shadow-2xl">
                <SideBar />
                <section className="flex-1 overflow-auto px-10 py-9">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-black">{title}</h1>
                            {subtitle ? <p className="mt-2 text-sm text-gray-500">{subtitle}</p> : null}
                        </div>
                        <div className="h-11 w-11 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                    {children}
                </section>
            </div>
        </main>
    );
}
