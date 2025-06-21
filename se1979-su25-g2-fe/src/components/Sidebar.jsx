import {
    FaHome, FaUser, FaBoxOpen, FaClipboardList, FaCogs,
    FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
    FaInfoCircle, FaImage, FaThList
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="h-full bg-gray-100 text-gray-800 flex flex-col justify-between shadow-md">
            <div>
                <div className="p-4 flex items-center justify-between">
                    <div className="font-bold text-lg">{sidebarCollapsed ? "🛍" : "WE"}</div>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded hover:bg-gray-200 transition"
                        title={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                    >
                        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
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
                                <SidebarItem to="/admin/settings/info" icon={<FaInfoCircle />} label="Thông tin" collapsed={sidebarCollapsed} />
                                <SidebarItem to="/admin/settings/banner" icon={<FaImage />} label="Banner" collapsed={sidebarCollapsed} />
                                <SidebarItem to="/admin/settings/categories" icon={<FaThList />} label="Danh mục sản phẩm" collapsed={sidebarCollapsed} />
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

function SidebarItem({ to, icon, label, collapsed }) {
    return (
        <li>
            <Link
                to={to}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
                <span className="text-lg">{icon}</span>
                {!collapsed && <span>{label}</span>}
            </Link>
        </li>
    );
}
