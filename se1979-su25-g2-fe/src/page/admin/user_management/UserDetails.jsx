import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { getAccountDetail } from "../../../service/accountService";

export default function UserDetail() {
    const { id } = useParams();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getAccountDetail(id);
            setUser(data);
        };
        fetchUser();
    }, [id]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}>
                <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                {user ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6">Chi tiết người dùng</h2>
                        <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl">
                            <Field label="Họ và tên" value={user.fullName || ""} />
                            <Field label="Tên tài khoản" value={user.username || ""} />
                            <Field label="Vai trò" value={user.role || ""} />
                            <Field label="Ngày sinh" value={user.dateOfBirth || ""} />
                            <Field label="Giới tính" value={user.gender || ""} />
                            <Field label="Email" value={user.email || ""} />
                            <Field label="Số điện thoại" value={user.phoneNumber || ""} />
                            <Field label="Địa chỉ" value={user.address || ""} />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Trạng thái:</span>
                                <span className={`font-semibold ${user.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>
                {user.status === "ACTIVE" ? "Hoạt động" : "Đình chỉ"}
              </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-600">Đang tải dữ liệu...</div>
                )}
            </div>
        </div>
    );
}

    function Field({ label, value }) {
    return (
        <div>
            <div className="text-sm text-gray-600">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    );
}
