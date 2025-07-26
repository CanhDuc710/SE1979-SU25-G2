import React, { useState, useEffect } from "react";
import { getUserOrderHistory, cancelUserOrder } from "../service/orderService";
import { IMAGE_BASE_URL } from "../utils/constants";

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [notification, setNotification] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const loadOrderHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUserOrderHistory(userId, {
                page: currentPage,
                size: 10,
                keyword: searchKeyword || undefined
            });

            setOrders(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError("Failed to load order history");
            console.error("Error loading order history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadOrderHistory();
        }
    }, [userId, currentPage]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 0) {
                loadOrderHistory();
            } else {
                setCurrentPage(0);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchKeyword]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
            return;
        }

        try {
            setCancellingOrderId(orderId);
            await cancelUserOrder(userId, orderId);

            // Update the order status in the local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId
                        ? { ...order, status: 'CANCELLED' }
                        : order
                )
            );

            showNotification("Đơn hàng đã được hủy thành công!", 'success');
        } catch (err) {
            showNotification(
                err.response?.data?.error || "Không thể hủy đơn hàng. Vui lòng thử lại.",
                'error'
            );
        } finally {
            setCancellingOrderId(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
            CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
            SHIPPED: "bg-green-100 text-green-800 border-green-200",
            DELIVERED: "bg-green-200 text-green-900 border-green-300",
            CANCELLED: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getStatusText = (status) => {
        const statusMap = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            SHIPPED: "Đang giao hàng",
            DELIVERED: "Đã giao hàng",
            CANCELLED: "Đã hủy"
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
                <button
                    onClick={loadOrderHistory}
                    className="ml-2 text-red-800 underline hover:no-underline"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`p-4 rounded-lg border-l-4 ${
                    notification.type === 'success' 
                        ? 'bg-green-50 border-green-400 text-green-700' 
                        : 'bg-red-50 border-red-400 text-red-700'
                }`}>
                    <div className="flex items-center justify-between">
                        <p>{notification.message}</p>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Lịch sử đơn hàng</h2>
                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">Chưa có đơn hàng nào</div>
                    <p className="text-gray-500">Các đơn hàng của bạn sẽ hiển thị ở đây</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Đơn hàng #{order.orderId}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(order.date)}
                                            </p>
                                        </div>
                                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">{order.total}</p>
                                        </div>
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.orderId)}
                                                disabled={cancellingOrderId === order.orderId}
                                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {cancellingOrderId === order.orderId ? 'Đang hủy...' : 'Hủy đơn'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.img ? (
                                                    <img
                                                        src={`${IMAGE_BASE_URL}${item.img}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiA0MkMxNiA0MiAxNiAyMiAzMiAyMlM0OCA0MiAzMiA0MloiIGZpbGw9IiNEMUQ1RDkiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyOCIgcj0iNCIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4=';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Trước
                    </button>

                    <div className="flex space-x-1">
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        pageNum === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* Results summary */}
            <div className="text-center text-sm text-gray-500">
                Hiển thị {orders.length} trong tổng số {totalElements} đơn hàng
            </div>
        </div>
    );
};

export default OrderHistory;
