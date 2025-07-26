import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../../service/orderService";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      showNotification(`Cập nhật trạng thái đơn hàng sang ${newStatus.toLowerCase()} thành công!`, 'success');
    } catch (error) {
      showNotification(`Cập nhật trạng thái đơn hàng thất bại: ${error.message}`, 'error');
    }
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const statusOptions = {
      PENDING: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CONFIRMED', 'SHIPPED', 'CANCELLED'],
      SHIPPED: ['SHIPPED', 'DELIVERED', 'CANCELLED'],
      DELIVERED: ['DELIVERED'],
      CANCELLED: ['CANCELLED']
    };
    return statusOptions[currentStatus] || [currentStatus];
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Không tìm thấy đơn hàng"}
            <button
              onClick={() => navigate('/admin/orders')}
              className="ml-4 text-red-800 underline hover:no-underline"
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isGuestOrder = !order.user;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          } transition-all duration-300 ease-in-out`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${
                notification.type === 'success' ? 'text-green-400' : 'text-red-400'
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
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    notification.type === 'success' 
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

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại danh sách đơn hàng
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chi tiết đơn hàng - MĐH-{order.orderId}
            </h1>
            <p className="text-gray-600">Thông tin và sản phẩm trong đơn hàng</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
              {order.status === "PENDING" && "Chờ xác nhận"}
              {order.status === "CONFIRMED" && "Đã xác nhận"}
              {order.status === "SHIPPED" && "Đã giao cho vận chuyển"}
              {order.status === "DELIVERED" && "Đã giao hàng"}
              {order.status === "CANCELLED" && "Đã hủy"}
              {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(order.status) === -1 &&
                (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase())}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Mã đơn hàng</label>
                  <p className="text-lg font-semibold text-gray-900">MĐH-{order.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ngày đặt hàng</label>
                  <p className="text-lg text-gray-900">{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phương thức thanh toán</label>
                  <p className="text-lg text-gray-900">{order.paymentMethod || 'Thanh toán khi nhận hàng'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tổng tiền</label>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin khách hàng
                {isGuestOrder && (
                  <span className="ml-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">
                    Khách lẻ
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
                  <p className="text-lg text-gray-900">{order.user?.fullName || 'Khách lẻ'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg text-gray-900">{order.user?.email || 'Không có'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-lg text-gray-900">{order.user?.phone || 'Không có'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tên đăng nhập</label>
                  <p className="text-lg text-gray-900">{order.user?.username || 'Không có'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tên người nhận</label>
                  <p className="text-lg text-gray-900">{order.shippingName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-lg text-gray-900">{order.shippingPhone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Địa chỉ giao hàng</label>
                  <p className="text-lg text-gray-900">{order.shippingAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tỉnh/Thành phố</label>
                  <p className="text-lg text-gray-900">{order.province?.name || 'Không có'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Quận/Huyện</label>
                  <p className="text-lg text-gray-900">{order.district?.name || 'Không có'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phường/Xã</label>
                  <p className="text-lg text-gray-900">{order.ward?.name || 'Không có'}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm trong đơn hàng</h2>
              <div className="space-y-4">
                {order.items && order.items.map((item, index) => (
                  <div key={item.orderItemId || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.productVariant?.imageUrl ? (
                          <img 
                            src={`http://localhost:8080${item.productVariant.imageUrl}`}
                            alt={item.productVariant.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA1MkMxOCA1MiAxOCAyOCA0MCAyOFM2MiA1MiA0MCA1MloiIGZpbGw9IiNEMUQ1RDkiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNiIgcj0iNiIgZmlsbD0iI0QxRDVEOSIvPgo8L3N2Zz4=';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.productVariant?.productName || 'Không xác định'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Màu sắc:</span>
                            <p className="text-gray-900">{item.productVariant?.color || 'Không có'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Kích cỡ:</span>
                            <p className="text-gray-900">{item.productVariant?.size || 'Không có'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Số lượng:</span>
                            <p className="text-gray-900">{item.quantity}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Đơn giá:</span>
                            <p className="text-gray-900">{formatCurrency(item.productVariant?.unitPrice || 0)}</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-500">Thành tiền:</span>
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border ${getStatusColor(order.status)}`}>
                  <div className="text-center">
                    <div className="text-sm font-medium">Trạng thái hiện tại</div>
                    <div className="text-lg font-bold">
                      {order.status === "PENDING" && "Chờ xác nhận"}
                      {order.status === "CONFIRMED" && "Đã xác nhận"}
                      {order.status === "SHIPPED" && "Đã giao cho vận chuyển"}
                      {order.status === "DELIVERED" && "Đã giao hàng"}
                      {order.status === "CANCELLED" && "Đã hủy"}
                      {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(order.status) === -1 &&
                        (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase())}
                    </div>
                  </div>
                </div>
                
                {(order.status !== 'DELIVERED' && order.status !== 'CANCELLED') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cập nhật trạng thái
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {getAvailableStatusOptions(order.status).map(status => (
                        <option key={status} value={status}>
                          {status === "PENDING" && "Chờ xác nhận"}
                          {status === "CONFIRMED" && "Đã xác nhận"}
                          {status === "SHIPPED" && "Đã giao cho vận chuyển"}
                          {status === "DELIVERED" && "Đã giao hàng"}
                          {status === "CANCELLED" && "Đã hủy"}
                          {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].indexOf(status) === -1 &&
                            (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số sản phẩm:</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng:</span>
                  <span className="font-medium">
                    {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Tổng tiền:</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  In đơn hàng
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Quay lại danh sách đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
