// AdminLayout.jsx
import React from "react";
import Sidebar from "../ui/admin/sidebar";

export default function AdminLayout({ children, activeMenu }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
            <Sidebar activeItem={activeMenu} />
            <main style={{ flexGrow: 1, padding: 20 }}>{children}</main>
        </div>
    );
}
