import {
    FaHome, FaUser, FaBoxOpen, FaClipboardList, FaCogs,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
    FaInfoCircle, FaImage, FaThList
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import * as storeService from "../service/storeService";

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [store, setStore] = useState({ storeName: "", logo: "" });
    const location = useLocation();

    useEffect(() => {
        (async () => {
            try {
                const data = await storeService.getStoreInformation();
                setStore({ storeName: data.storeName, logo: data.logo });
            } catch {}
        })();
    }, []);

    const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";
    return (
        <div
            className={`h-screen bg-gray-100 text-gray-800 flex flex-col justify-between shadow-md transition-all duration-200 ${sidebarWidth} fixed top-0 left-0 z-40`}
            style={{ minHeight: "100vh" }}
        >
            <div>
                {/* Logo + Tên shop */}
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} p-4`}>
                    <Link to="/" className="flex items-center gap-2 min-w-0">
                        {store.logo
                            ? <img src={store.logo} alt="Logo" className="h-10 w-10 object-contain rounded-full bg-white p-1" />
                            : <span className="font-bold text-2xl bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center">WE</span>
                        }
                        {!sidebarCollapsed && (
                            <span className="ml-2 font-bold text-lg truncate">{store.storeName || ""}</span>
                        )}
                    </Link>
                    {/*{!sidebarCollapsed && (*/}
                    {/*    <button*/}
                    {/*        onClick={() => setSidebarCollapsed(true)}*/}
                    {/*        className="p-2 rounded hover:bg-gray-200 transition ml-2"*/}
                    {/*        title="Thu gọn"*/}
                    {/*    >*/}
                    {/*        <FaChevronLeft />*/}
                    {/*    </button>*/}
                    {/*)}*/}
                    {sidebarCollapsed && (
                        <button
                            onClick={() => setSidebarCollapsed(false)}
                            className="p-2 rounded hover:bg-gray-200 transition"
                            title="Mở rộng"
                        >
                            <FaChevronRight />
                        </button>
                    )}
                </div>

                <ul className="space-y-2 px-2">
                    <SidebarItem to="/admin/dashboard" icon={<FaHome />} label="Thống kê" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/orders" icon={<FaClipboardList />} label="Đơn hàng" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/products" icon={<FaBoxOpen />} label="Sản phẩm" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/discount" icon={<FaBoxOpen />} label="Giảm giá" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/accounts" icon={<FaUser />} label="Tài khoản" collapsed={sidebarCollapsed} />

                    {/* Mục Cài đặt với các submenu */}
                    <li>
                        <div
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition cursor-pointer"
                        >
                            <span className="text-lg"><FaCogs /></span>
                            {!sidebarCollapsed && (
                                <>
                                    <span className="flex-1">Cài đặt</span>
                                    {settingsOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </>
                            )}
                        </div>

                        {/* Submenu */}
                        {!sidebarCollapsed && settingsOpen && (
                            <ul className="ml-8 mt-1 space-y-1 text-sm text-gray-700">
                                <SidebarItem to="/admin/settings/storeInformation" icon={<FaInfoCircle />} label="Thông tin cửa hàng" collapsed={sidebarCollapsed} />
                                <SidebarItem to="/admin/settings/banners" icon={<FaImage />} label="Banner" collapsed={sidebarCollapsed} />
                                <SidebarItem to="/admin/settings/categories" icon={<FaThList />} label="Danh mục sản phẩm" collapsed={sidebarCollapsed} />
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

// Item component
function SidebarItem({ to, icon, label, collapsed }) {
    return (
        <li>
            <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition ${
                    collapsed ? "justify-center" : ""
                }`}
            >
                <span className="text-lg">{icon}</span>
                {!collapsed && <span>{label}</span>}
            </Link>
        </li>
    );
}
