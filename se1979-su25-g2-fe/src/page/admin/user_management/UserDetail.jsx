import {useNavigate, useParams, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccountDetail, banAccount, unbanAccount } from "../../../service/accountService";
import { FaArrowCircleLeft ,FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import OrderHistory from "./OrderHistory.jsx";

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("info");
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [userStatus, setUserStatus] = useState("");

    const sexLabel = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
    const roleLabels = { ADMIN: "Quản trị viên", STAFF: "Nhân viên", CUSTOMER: "Người dùng" };

    // Đồng bộ activeTab với URL khi component mount hoặc URL thay đổi
    useEffect(() => {
        if (pathname.endsWith(`/orders`)) {
            setActiveTab("orders");
        } else {
            setActiveTab("info");
        }
    }, [pathname]);

    // Fetch user detail
    useEffect(() => {
        const fetchUser = async () => {
            setLoadingStatus(true);
            try {
                const data = await getAccountDetail(id);
                setUser(data);
                setUserStatus(data.status);
            } catch (err) {
                console.error("Lỗi khi tải thông tin tài khoản:", err);
                alert("Lỗi khi tải thông tin tài khoản. Vui lòng thử lại!");
            } finally {
                setLoadingStatus(false);
            }
        };
        if (id) fetchUser();
    }, [id]);

    const handleToggleStatus = async () => {
        if (loadingStatus) return;
        setLoadingStatus(true);
        try {
            if (userStatus === "ACTIVE") {
                await banAccount(id);
            } else {
                await unbanAccount(id);
            }
            const updated = await getAccountDetail(id);
            setUser(updated);
            setUserStatus(updated.status);
            alert(`Trạng thái tài khoản đã được cập nhật thành: ${updated.status === "ACTIVE" ? "HOẠT ĐỘNG" : "BỊ CẤM"}`);
        } catch (err) {
            console.error("Cập nhật trạng thái thất bại:", err);
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại!");
        } finally {
            setLoadingStatus(false);
        }
    };

    // Loading state
    if (!user && loadingStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-blue-500 text-lg flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    if (!user && !loadingStatus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-red-500 text-lg">Không tìm thấy thông tin người dùng hoặc có lỗi xảy ra.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header: arrow + title on left, full width */}
            <div className="px-6 py-4 bg-white shadow-sm mb-6">
                <button
                    onClick={() => navigate(`/admin/accounts`)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                    <FaArrowCircleLeft size={24} />
                </button>
                <span className="ml-4 text-3xl font-extrabold text-gray-800">
                    Quản lý tài khoản người dùng
                </span>
            </div>

            {/* Main content area: now expands fully, no white frame on outer container */}
            <div className="flex-1 p-6"> {/* Đã loại bỏ justify-center và items-start, chỉ giữ p-6 */}
                {/* Loại bỏ bg-white, p-8, rounded-lg, shadow-xl, max-w-4xl */}
                <div className="w-full">
                    {/* Tabs - vẫn giữ phong cách hiện đại */}
                    <div className="flex space-x-3 mb-8 border-b border-gray-200">
                        <button
                            className={`px-5 py-3 text-lg font-medium rounded-t-lg transition-colors ${activeTab === "info" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => navigate(`/admin/accounts/${id}`)}
                        >Thông tin cá nhân</button>
                        <button
                            className={`px-5 py-3 text-lg font-medium rounded-t-lg transition-colors ${activeTab === "orders" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => navigate(`/admin/accounts/${id}/orders`)}
                        >Đơn hàng</button>
                    </div>

                    {/* Content Area for Tabs */}
                    {activeTab === "info" ? (
                        // Sử dụng grid để hiển thị 2 cột, đặt trong một div có nền trắng riêng
                        <div className="bg-white p-8 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <Field label="Họ và tên" value={`${user.firstName || ''} ${user.lastName || ''}`} />
                            <Field label="Tên tài khoản" value={user.username || ''} />
                            <Field label="Email" value={user.email || ''} />
                            <Field label="Số điện thoại" value={user.phoneNumber || ''} />
                            <Field label="Vai trò" value={roleLabels[user.role] || ''} />
                            <Field label="Ngày sinh" value={user.dob || ''} />
                            <Field label="Giới tính" value={sexLabel[user.sex] || ''} />

                            {/* Status Toggle - span 2 columns */}
                            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg shadow-inner mt-4">
                                <div className="flex items-center mb-2 text-blue-700">
                                    <FaUser className="mr-2 text-xl" />
                                    <span className="font-semibold text-lg">Trạng thái tài khoản</span>
                                </div>
                                <div className="flex items-center justify-between pl-10">
                                    <div className="flex items-center">
                                        {userStatus === "ACTIVE" ? (
                                            <FaCheckCircle className="text-green-600 mr-2 text-xl" />
                                        ) : (
                                            <FaTimesCircle className="text-red-600 mr-2 text-xl" />
                                        )}
                                        <span className={`font-bold text-xl ${userStatus === "ACTIVE" ? "text-green-700" : "text-red-700"}`}> {userStatus} </span>
                                    </div>
                                    <label className="relative inline-block w-14 h-8 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="opacity-0 w-0 h-0"
                                            checked={userStatus === "ACTIVE"}
                                            onChange={handleToggleStatus}
                                            disabled={loadingStatus}
                                        />
                                        <span className={`absolute inset-0 rounded-full transition-colors duration-300 ${userStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></span>
                                        <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${userStatus === "ACTIVE" ? "translate-x-6" : "translate-x-0"}`}></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // OrderHistory sẽ được hiển thị trực tiếp trong container lớn
                        // Nếu OrderHistory có khung trắng riêng, bạn có thể cân nhắc loại bỏ nó
                        <OrderHistory userId={id} />
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <div className="text-sm font-semibold text-gray-600">{label}</div>
            <div className="font-medium text-gray-800 mt-1">{value || '-'}</div>
        </div>
    );
}