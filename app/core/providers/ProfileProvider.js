"use client";
import { ProfileContext } from "../contexts/ProfileContext";
import { useState } from "react";

export default function ProfileContextProvider({ children }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");

    function storeDetails(email, password, accessToken, investorId = "", role = "") {
        setEmail(email);
        setPassword(password);
        setToken(accessToken || "");
        if (accessToken) {
            document.cookie = `token=${accessToken}; path=/`;
        }
        if (investorId) {
            document.cookie = `investor_id=${investorId}; path=/`;
        }
        if (role) {
            document.cookie = `role=${role}; path=/`;
        }
    }
    return (
        <ProfileContext.Provider value={{ email, password, token, storeDetails }}>
            {children}
        </ProfileContext.Provider>
    )
}
