import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { FaEye, FaCheckCircle, FaCheck, FaBan, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Pagination from "../../../components/Pagination.jsx";

export default function OrderList() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState({});

    const [orders] = useState([
        {
            orderId: "123421",
            date: "20/2/2025",
            total: "680.000 VND",
            status: "PENDING",
            items: [
                { name: "T-Shirt Groot Black", quantity: 1, img: "https://via.placeholder.com/50" },
                { name: "T-Shirt Love Kills", quantity: 1, img: "https://via.placeholder.com/50" },
            ],
        },
        {
            orderId: "123441",
            date: "14/2/2025",
            total: "700.000 VND",
            status: "COMPLETED",
            items: [
                { name: "T-Shirt Love Kills", quantity: 2, img: "https://via.placeholder.com/50" },
            ],
        },
        {
            orderId: "123411",
            date: "12/2/2025",
            total: "610.000 VND",
            status: "DELIVERING",
            items: [
                { name: "Túi đeo chéo", quantity: 1, img: "https://via.placeholder.com/50" },
            ],
        },
        {
            orderId: "123426",
            date: "11/2/2025",
            total: "610.000 VND",
            status: "FAILED",
            items: [
                { name: "Túi đeo chéo", quantity: 1, img: "https://via.placeholder.com/50" },
            ],
        },
        {
            orderId: "123422",
            date: "9/2/2025",
            total: "610.000 VND",
            status: "REJECTED",
            items: [
                { name: "T-Shirt Love Kills", quantity: 2, img: "https://via.placeholder.com/50" },
            ],
        },
    ]);

    const statusLabels = {
        PENDING: "Chờ xác nhận",
        COMPLETED: "Hoàn thành",
        FAILED: "Thất bại",
        DELIVERING: "Chờ giao hàng",
        REJECTED: "Đã từ chối",
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div
                className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} flex-shrink-0`}
            >
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                />
            </div>

            <div className="flex-1 p-6">
                <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng</h2>
                <div className="overflow-x-auto rounded shadow-md">
                    <table className="min-w-full text-sm bg-white rounded">
                        <thead className="bg-gradient-to-r from-blue-100 to-yellow-100 text-gray-700 text-left">
                        <tr>
                            <th className="px-4 py-3">Mã đơn</th>
                            <th className="px-4 py-3">Sản phẩm</th>
                            <th className="px-4 py-3">Ngày đặt</th>
                            <th className="px-4 py-3">Giá tiền</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <>
                                <tr key={order.orderId} className="border-t hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-medium">{order.orderId}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <img src={order.items[0].img} alt="product" className="w-8 h-8" />
                                            <span>{order.items[0].name} x{order.items[0].quantity}</span>
                                        </div>
                                        {order.items.length > 1 && (
                                            <button
                                                onClick={() => toggleExpand(order.orderId)}
                                                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                            >
                                                {expandedOrders[order.orderId] ? (
                                                    <><FaChevronUp /> Thu gọn</>
                                                ) : (
                                                    <><FaChevronDown /> Xem thêm</>
                                                )}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{order.date}</td>
                                    <td className="px-4 py-2">{order.total}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`font-semibold flex items-center gap-1 ${
                                                order.status === "COMPLETED"
                                                    ? "text-green-600"
                                                    : order.status === "PENDING"
                                                        ? "text-yellow-600"
                                                        : order.status === "DELIVERING"
                                                            ? "text-blue-600"
                                                            : "text-red-600"
                                            }`}
                                        >
                                            <FaCheckCircle /> {statusLabels[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button className="bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">
                                            <FaEye />
                                        </button>
                                        {order.status === "PENDING" && (
                                            <>
                                                <button className="bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200">
                                                    <FaCheck />
                                                </button>
                                                <button className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200">
                                                    <FaBan />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expandedOrders[order.orderId] && (
                                    <tr className="bg-gray-50">
                                        <td></td>
                                        <td colSpan={5} className="px-4 py-2">
                                            {order.items.slice(1).map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 mb-1">
                                                    <img src={item.img} alt="product" className="w-8 h-8" />
                                                    <span>{item.name} x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">Hiển thị {orders.length} đơn hàng</div>
            </div>
        </div>
    );
}
