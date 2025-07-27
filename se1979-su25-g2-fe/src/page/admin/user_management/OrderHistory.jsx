import React, { useState, useEffect } from "react";
import { FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Pagination from "../../../components/Pagination";
import { getOrderHistory } from "../../../service/accountService";

export default function OrderHistory({ userId }) {
    const [orders, setOrders] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const statusLabels = {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Hoàn thành",
        DELIVERED: "Đã bắt đầu giao hàng",
        CANCELLED: "Đã từ chối",
        SHIPPED: "Đã giao"
    };

    const fetchOrders = async (p) => {
        setLoading(true);
        try {
            const {content, totalPages: tp} = await getOrderHistory(userId, {page: p, size: 10, keyword: search});
            setOrders(content);
            setTotalPages(tp);
        } catch (err) {
            console.error("Lỗi khi load đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(0);
        fetchOrders(0);
    }, [userId, search]);

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const toggleExpand = (id) =>
        setExpanded((e) => ({...e, [id]: !e[id]}));

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Lịch sử đơn hàng</h3>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded px-3 py-1 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải đơn hàng...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Mã đơn</th>
                            <th className="px-4 py-2">Sản phẩm</th>
                            <th className="px-4 py-2">Ngày đặt</th>
                            <th className="px-4 py-2">Giá tiền</th>
                            <th className="px-4 py-2">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => {
                                const first = o.items?.[0];
                                const hasMore = o.items?.length > 1;
                                return (
                                    <React.Fragment key={o.orderId}>
                                        <tr className="border-t hover:bg-gray-50 transition">
                                            <td className="px-4 py-2 align-top">{o.orderId}</td>

                                            {/* SẢN PHẨM */}
                                            <td className="px-4 py-2 align-top">
                                                {first ? (
                                                    <div className="flex items-center">
                                                        <img
                                                            src={first.img}
                                                            alt={first.name}
                                                            className="w-16 h-16 object-cover rounded-md"
                                                        />
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                                {first.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                x{first.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No items</span>
                                                )}

                                                {hasMore && (
                                                    <div className="mt-2 space-y-1">
                                                        {expanded[o.orderId] && (
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                {o.items.slice(1).map((it, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="flex items-center gap-2 mb-1"
                                                                    >
                                                                        <img
                                                                            src={it.img}
                                                                            alt={it.name}
                                                                            className="w-12 h-12 object-cover rounded"
                                                                        />
                                                                        <span className="text-sm">
                                      {it.name} x{it.quantity}
                                    </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => toggleExpand(o.orderId)}
                                                            className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                                                        >
                                                            {expanded[o.orderId] ? (
                                                                <>
                                                                    <FaChevronUp/> Thu gọn
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaChevronDown/> Xem thêm
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-2 align-top">{o.date} </td>
                                            <td className="px-4 py-2 align-top">{o.total}</td>
                                            <td className="px-4 py-2 align-top">
                                                {statusLabels[o.status]}
                                            </td>

                                        </tr>
                                    </React.Fragment>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4 flex justify-center">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}