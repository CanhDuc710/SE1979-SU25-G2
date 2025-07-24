import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        // JWT: header.payload.signature
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || payload.roles || null;
    } catch {
        return null;
    }
}

export default function ProtectedAdminRoute({ children }) {
    const location = useLocation();
    const role = getUserRole();
    if (!role || (Array.isArray(role) ? !role.includes("ADMIN") : role !== "ADMIN")) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}

