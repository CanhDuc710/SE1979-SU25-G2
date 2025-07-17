// @ts-nocheck
import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../../service/orderService";
import Pagination from "../../../components/Pagination";

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

  // Load data - Following discount pattern
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading orders with params:", {
        page: currentPage,
        size: 8,
        status: selectedStatus,
        searchTerm: searchTerm,
        searchBy: searchBy
      });

      const data = await getAllOrders({
        page: currentPage,
        size: 8,
        status: selectedStatus,
        searchTerm: searchTerm,
        searchBy: searchBy,
        sortBy: sortBy,
        direction: direction
      });

      console.log("Received data:", data);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching orders:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);

      let errorMessage = "Unknown error";
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network Error: No response from server";
      } else {
        // Something else happened
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
      // Update local state immediately for better UX
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Make API call to update status on backend
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Revert the change if API call fails
      loadOrders();
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
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            {/* Filter by Status */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search Orders */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Orders
              </label>
              <input
                type="text"
                placeholder={
                  searchBy === "customer" ? "Search by customer name..." :
                    searchBy === "phone" ? "Search by phone number..." :
                      searchBy === "address" ? "Search by address..." :
                        "Search orders..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Search By */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search By
              </label>
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="all">All Fields</option>
                <option value="customer">Customer Name</option>
                <option value="phone">Phone Number</option>
                <option value="address">Address</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="orderDate">Order Date</option>
                <option value="orderId">Order ID</option>
                <option value="totalAmount">Total Amount</option>
                <option value="status">Status</option>
                <option value="shippingName">Customer Name</option>
              </select>
            </div>

            {/* Direction */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Showing {orders.length}</span> of <span className="font-medium text-gray-900">{totalElements}</span> orders
              </div>
              <div className="text-xs text-gray-500">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedStatus !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {selectedStatus}
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
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isGuestOrder = !order.customerInfo;
                  return (
                    <tr key={order.orderId} className={`hover:bg-gray-50 dark:hover:bg-gray-50 ${isGuestOrder ? 'bg-yellow-50 dark:bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-900">
                            ORD-{order.orderId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.numberOfProducts} items
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            Ship to: {order.shippingAddressFull}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-900">
                            {order.customerInfo?.fullName || order.shippingName}
                            {isGuestOrder && (
                              <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Guest
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.customerInfo?.email || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-500">
                            {order.shippingPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-900">
                          {formatDate(order.orderDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-600 dark:hover:text-blue-900 bg-transparent dark:bg-transparent border-none dark:border-none shadow-none dark:shadow-none">
                            View
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.orderId, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-white text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
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

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-100 border border-red-400 text-red-700 dark:text-red-700 rounded">
            Error loading orders: {error}
            <button
              onClick={() => loadOrders()}
              className="ml-2 text-red-800 dark:text-red-800 underline hover:no-underline"
            >
              Retry
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
            Trang {currentPage + 1} / {totalPages} • Total: {totalElements} orders
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
