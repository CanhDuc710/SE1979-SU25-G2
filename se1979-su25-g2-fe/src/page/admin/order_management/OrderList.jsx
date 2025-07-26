import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../../service/orderService";
import Pagination from "../../../components/Pagination";

// ProductList component for displaying order items
const ProductList = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-500">Không có sản phẩm</div>;
  }

  const firstItem = items[0];
  const remainingCount = items.length - 1;

  return (
    <div className="space-y-2">
      {/* First product - always visible */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {firstItem.productVariant?.imageUrl ? (
            <img
              src={`http://localhost:8080${firstItem.productVariant.imageUrl}`}
              alt={firstItem.productVariant.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkM5IDI2IDkgMTQgMjAgMTRTMzEgMjYgMjAgMjZaIiBmaWxsPSIjRDFENUQ5Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTgiIHI9IjMiIGZpbGw9IiNEMUQ1RDkiLz4KPC9zdmc+';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {firstItem.productVariant?.productName || 'Sản phẩm không xác định'}
          </div>
          <div className="text-xs text-gray-500">
            {firstItem.productVariant?.color && firstItem.productVariant?.size
              ? `${firstItem.productVariant.color} - ${firstItem.productVariant.size}`
              : 'Không có thông tin biến thể'} × {firstItem.quantity}
          </div>
        </div>
      </div>

      {/* Expanded products list - appears ABOVE the button */}
      {isExpanded && remainingCount > 0 && (
        <div className="mt-3 mb-2 space-y-3">
          {items.slice(1).map((item, index) => (
            <div key={item.orderItemId || index} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {item.productVariant?.imageUrl ? (
                  <img
                    src={`http://localhost:8080${item.productVariant.imageUrl}`}
                    alt={item.productVariant.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkM5IDI2IDkgMTQgMjAgMTRTMzEgMjYgMjAgMjZaIiBmaWxsPSIjRDFENUQ5Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTgiIHI9IjMiIGZpbGw9IiNEMUQ1RDkiLz4KPC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.productVariant?.productName || 'Sản phẩm không xác định'}
                </div>
                <div className="text-xs text-gray-500">
                  {item.productVariant?.color && item.productVariant?.size
                    ? `${item.productVariant.color} - ${item.productVariant.size}`
                    : 'Không có thông tin biến thể'} × {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expand/Collapse button for multiple products - stays at the bottom */}
      {remainingCount > 0 && (
        <div className="border-t border-gray-200 pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 px-2 py-1 rounded transition-colors"
            style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
          >
            <span>{remainingCount} sản phẩm</span>
            <svg
              className={`ml-1 w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: '#374151' }}
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("orderDate");
  const [direction, setDirection] = useState("desc");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const statusOptions = {
      PENDING: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ],
      CONFIRMED: [
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ],
      SHIPPED: [
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ],
      DELIVERED: [
        { value: 'DELIVERED', label: 'Delivered' }
      ],
      CANCELLED: [
        { value: 'CANCELLED', label: 'Cancelled' }
      ]
    };

    return statusOptions[currentStatus] || [
      { value: currentStatus, label: currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase() }
    ];
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllOrders({
        page: currentPage,
        size: 8,
        status: selectedStatus,
        searchTerm: searchTerm,
        searchBy: searchBy,
        sortBy: sortBy,
        direction: direction
      });

      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      let errorMessage = "Unknown error";
      if (err.response) {
        errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Network Error: No response from server";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when page changes
  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  // Load orders when status filter or sorting changes immediately
  useEffect(() => {
    if (currentPage === 0) {
      loadOrders();
    } else {
      setCurrentPage(0);
    }
  }, [selectedStatus, searchBy, sortBy, direction]);

  // Debounced search for search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 0) {
        loadOrders();
      } else {
        setCurrentPage(0);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-green-100 text-green-800",
      DELIVERED: "bg-green-200 text-green-900",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      await updateOrderStatus(orderId, newStatus);
      showNotification(`Order #${orderId} status updated to ${newStatus.toLowerCase()} successfully!`, 'success');
    } catch (error) {
      loadOrders();
      showNotification(`Failed to update order status: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  // Backend handles all filtering now, no need for client-side filtering
  const filteredOrders = orders;

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-50 dark:text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600 dark:text-gray-600">Quản lý và theo dõi tất cả đơn hàng của khách hàng</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            {/* Filter by Status */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lọc theo trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="all">Tất cả đơn hàng</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipped">Đã giao cho vận chuyển</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            {/* Search Orders */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tìm kiếm đơn hàng
              </label>
              <input
                type="text"
                placeholder={
                  searchBy === "customer" ? "Tìm theo tên khách hàng..." :
                    searchBy === "phone" ? "Tìm theo số điện thoại..." :
                      searchBy === "address" ? "Tìm theo địa chỉ..." :
                        "Tìm kiếm đơn hàng..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Search By */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tìm kiếm theo
              </label>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="all">Tất cả trường</option>
                <option value="customer">Tên khách hàng</option>
                <option value="phone">Số điện thoại</option>
                <option value="address">Địa chỉ</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="orderDate">Ngày đặt hàng</option>
                <option value="orderId">Mã đơn hàng</option>
                <option value="totalAmount">Tổng tiền</option>
                <option value="status">Trạng thái</option>
                <option value="shippingName">Tên khách hàng</option>
              </select>
            </div>

            {/* Direction */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thứ tự
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Hiển thị {orders.length}</span> trên tổng <span className="font-medium text-gray-900">{totalElements}</span> đơn hàng
              </div>
              <div className="text-xs text-gray-500">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    Tìm kiếm: "{searchTerm}"
                  </span>
                )}
                {selectedStatus !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Trạng thái: {selectedStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Chi tiết đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Ngày đặt hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isGuestOrder = !order.customerInfo;
                  return (
                    <tr key={order.orderId} className={`hover:bg-gray-50 dark:hover:bg-gray-50 ${isGuestOrder ? 'bg-yellow-50 dark:bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-900">
                            MĐH-{order.orderId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.numberOfProducts} sản phẩm
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500 truncate" title={order.shippingAddressFull}>
                            Giao đến: {order.shippingAddressFull?.length > 30 
                              ? `${order.shippingAddressFull.substring(0, 30)}...` 
                              : order.shippingAddressFull}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ProductList items={order.items || []} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-900">
                            {order.customerInfo?.fullName || order.shippingName}
                            {isGuestOrder && (
                              <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Khách lẻ
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.customerInfo?.email || "Không có"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.shippingPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-900">
                          <div>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</div>
                          <div className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status === "PENDING" && "Chờ xác nhận"}
                          {order.status === "CONFIRMED" && "Đã xác nhận"}
                          {order.status === "SHIPPED" && "Đã giao cho vận chuyển"}
                          {order.status === "DELIVERED" && "Đã giao hàng"}
                          {order.status === "CANCELLED" && "Đã hủy"}
                          {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(order.status) === -1 &&
                            (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.location.href = `/admin/orders/${order.orderId}`}
                            className="text-blue-600 hover:text-blue-900 bg-transparent border-none shadow-none transition-colors"
                          >
                            Xem
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.orderId, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-white text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          >
                            {getAvailableStatusOptions(order.status).map(status => (
                              <option key={status.value} value={status.value}>
                                {status.value === "PENDING" && "Chờ xác nhận"}
                                {status.value === "CONFIRMED" && "Đã xác nhận"}
                                {status.value === "SHIPPED" && "Đã giao cho vận chuyển"}
                                {status.value === "DELIVERED" && "Đã giao hàng"}
                                {status.value === "CANCELLED" && "Đã hủy"}
                                {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(status.value) === -1 &&
                                  (status.label)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${notification.type === 'success'
            ? 'bg-green-50 border-green-400 text-green-700'
            : 'bg-red-50 border-red-400 text-red-700'
            } transition-all duration-300 ease-in-out`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setNotification(null)}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${notification.type === 'success'
                    ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                    : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                    }`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-100 border border-red-400 text-red-700 dark:text-red-700 rounded">
            Lỗi tải đơn hàng: {error}
            <button
              onClick={() => loadOrders()}
              className="ml-2 text-red-800 dark:text-red-800 underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-gray-600 text-sm">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="text-gray-600 dark:text-gray-600">
            Trang {currentPage + 1} / {totalPages} • Tổng: {totalElements} đơn hàng
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
