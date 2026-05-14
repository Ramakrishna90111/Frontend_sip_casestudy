import "./globals.css";
import ProfileContextProvider from "./core/providers/ProfileProvider";

export const metadata = {
  title: "KFin Wings",
  description: "SIP portfolio dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#d7d7df]">
        <ProfileContextProvider>{children}</ProfileContextProvider>
      </body>
    </html>
  );
}
