import React, { useState } from "react"; // Import useState
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const contentMarginLeft = sidebarCollapsed ? "64px" : "256px";

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
            <Sidebar
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <main
                style={{
                    flexGrow: 1,
                    padding: 20,
                    marginLeft: contentMarginLeft,
                    transition: "margin-left 200ms ease-in-out",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}