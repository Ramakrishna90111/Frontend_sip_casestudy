"use client";
import { useState, useEffect, useCallback } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const stored = localStorage.getItem("kfin-theme");
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("kfin-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback((t) => {
        setTheme(t);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
