import { FaHome, FaUser, FaBoxOpen, FaClipboardList, FaCogs, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed }) {
    return (
        <div className="h-full bg-gray-100 text-gray-800 flex flex-col justify-between shadow-md">
            <div>
                <div className="p-4 flex items-center justify-between">
                    <div className="font-bold text-lg">
                        {sidebarCollapsed ? "🛍" : "WE"}
                    </div>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded hover:bg-gray-200 transition"
                        title={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                    >
                        {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                    </button>
                </div>

                <ul className="space-y-2 px-2">
                    <SidebarItem to="/admin/dashboard" icon={<FaHome />} label="Dashboard" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/orders" icon={<FaClipboardList />} label="Orders" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/products" icon={<FaBoxOpen />} label="Products" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/discount" icon={<FaBoxOpen />} label="Discount" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/users" icon={<FaUser />} label="Users" collapsed={sidebarCollapsed} />
                    <SidebarItem to="/admin/settings" icon={<FaCogs />} label="Settings" collapsed={sidebarCollapsed} />
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
