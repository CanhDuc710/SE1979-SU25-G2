import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEye, FaBan, FaCheckCircle } from "react-icons/fa";
import { fetchAccounts } from "/src/service/accountService.js";

export default function UserList() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchUsers = async () => {
        try {
            const data = await fetchAccounts({
                keyword: search,
                status: filterStatus,
                role: filterRole,
                page: 0,
                size: 20,
            });
            setUsers(data.content || []);
            setTotal(data.totalElements || 0);
        } catch (err) {
            console.error("Lỗi khi gọi API:", err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole, filterStatus, search]);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ${
                    sidebarCollapsed ? "w-16" : "w-64"
                } flex-shrink-0`}
            >
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
            </div>

            {/* Main */}
            <div className="flex-1 p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="BANNED">Banned</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.userId} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2 flex items-center gap-2">
                                    {/*<img*/}
                                    {/*    src="https://via.placeholder.com/30"*/}
                                    {/*    className="rounded-full w-8 h-8"*/}
                                    {/*    alt="avatar"*/}
                                    {/*/>*/}
                                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                                            {user.username}
                                        </span>
                                </td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.roleName}</td>
                                <td className="px-4 py-2">
                                        <span
                                            className={`font-semibold flex items-center gap-1 ${
                                                user.status === "ACTIVE"
                                                    ? "text-green-600"
                                                    : user.status === "INACTIVE"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                            }`}
                                        >
                                            <FaCheckCircle /> {user.status}
                                        </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                                        <FaEye />
                                    </button>
                                    <button className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                                        <FaBan />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                    Đang hiển thị {users.length} / {total} tài khoản
                </div>
            </div>
        </div>
    );
}
