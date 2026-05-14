export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen theme-bg-page bg-grid flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 animate-gradient pointer-events-none" />
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                {children}
            </div>
        </main>
    );
}
