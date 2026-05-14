export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen bg-[#d7d7df] flex items-center justify-center px-4">
            {children}
        </main>
    );
}
