// Sidebar.jsx
import React from "react";

export default function Sidebar({ activeItem = "Product Management" }) {
    const menuItems = [
        "Dashboard",
        "Order Management",
        "Product Management",
        "User Management",
        "Settings",
    ];

    return (
        <aside style={{
            width: 220,
            backgroundColor: "#ddd",
            display: "flex",
            flexDirection: "column",
            padding: 20,
            height: "100vh",
            boxSizing: "border-box"
        }}>
            <div
                style={{
                    marginBottom: 30,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 20,
                    backgroundColor: "#bbb",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    lineHeight: "80px",
                    margin: "0 auto",
                }}
            >
                Logo
            </div>
            <nav style={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <div
                        key={item}
                        style={{
                            backgroundColor: item === activeItem ? "#3b82f6" : "#bbb",
                            color: item === activeItem ? "#fff" : "#333",
                            padding: "12px 15px",
                            fontWeight: "bold",
                            borderRadius: 6,
                            marginBottom: 10,
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            userSelect: "none",
                        }}
                    >
                        <span>{item}</span>
                        {item === "Settings" && <span style={{ fontWeight: "normal" }}>▼</span>}
                    </div>
                ))}
            </nav>
            <button
                style={{
                    marginTop: "auto",
                    padding: "12px 15px",
                    backgroundColor: "#bbb",
                    fontWeight: "bold",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </aside>
    );
}
