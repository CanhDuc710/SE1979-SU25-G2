import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import {FaEye, FaBan, FaCheckCircle, FaCheck} from "react-icons/fa";
import {getAccounts, banAccount, unbanAccount} from "../../../service/accountService";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination.jsx";

export default function UserList() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0); // Backend dùng index = 0
    const [totalPages, setTotalPages] = useState(0);
    const roleLabels = {
        ADMIN: "Quản trị viên",
        STAFF: "Nhân viên",
        CUSTOMER: "Người dùng",
    };
    const statusLabels = {
        ACTIVE: "Hoạt động",
        INACTIVE: "Không hoạt động",
        BANNED: "Bị đình chỉ",
    };

    const fetchUsers = async () => {
        try {
            const data = await getAccounts({
                keyword: search,
                status: filterStatus,
                role: filterRole,
                page: currentPage,
                size: 5
            });
            setUsers(data.content || []);
            setTotal(data.totalElements || 0);
            setTotalPages(data.totalPages);

        } catch (err) {
            console.error("Lỗi khi gọi API:", err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole, filterStatus, search, currentPage]);

    const handleBan = async (id) => {
        if (window.confirm("Bạn có chắc muốn ban tài khoản này?")) {
            await banAccount(id);
            fetchUsers();
        }
    };

    const handleUnban = async (id) => {
        if (window.confirm("Bạn có chắc muốn unban tài khoản này?")) {
            await unbanAccount(id);
            fetchUsers();
        }
    };

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
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="CUSTOMER">Người dùng</option>
                        <option value="STAFF">Nhân viên</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Không hoạt động</option>
                        <option value="BANNED">Bị đình chỉ</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Tên người dùng</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Vai trò</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.userId} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{user.username}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{roleLabels[user.roleName]}</td>
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
                                        <FaCheckCircle /> {statusLabels[user.status]}
                                    </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                                        onClick={() =>
                                            navigate(`/admin/accounts/${user.userId}`)
                                        }
                                    >
                                        <FaEye />
                                    </button>
                                    {user.status === "BANNED" ? (
                                        <button
                                            className="bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
                                            onClick={() => handleUnban(user.userId)}
                                        >
                                            <FaCheck />

                                        </button>
                                    ) : (
                                        <button
                                            className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                                            onClick={() => handleBan(user.userId)}
                                        >
                                            <FaBan />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
                <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    {/*<div>*/}
                    {/*    Trang {currentPage + 1} / {totalPages}*/}
                    {/*</div>*/}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Đang hiển thị {users.length} / {total} tài khoản
                </div>
            </div>
        </div>
    );
}
