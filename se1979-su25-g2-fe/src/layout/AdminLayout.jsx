import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
            <Sidebar />
            <main style={{ flexGrow: 1, padding: 20 }}>
                <Outlet />
            </main>
        </div>
    );
}
