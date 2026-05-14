import "./globals.css";
import ProfileContextProvider from "./core/providers/ProfileProvider";
import ThemeProvider from "./core/providers/ThemeProvider";

export const metadata = {
  title: "KFin Wings | SIP Portfolio Dashboard",
  description: "Professional SIP portfolio tracking, mutual fund management, and investment analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full font-['Inter',Arial,Helvetica,sans-serif]">
        <ThemeProvider>
          <ProfileContextProvider>{children}</ProfileContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
