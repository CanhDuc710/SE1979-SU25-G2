import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkVNPayReturn } from "../../service/orderService";

export default function VNPayReturnPage() {
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkPaymentResult = async () => {
            try {
                // Lấy các query parameters từ URL
                const urlParams = new URLSearchParams(location.search);
                const params = {};

                for (const [key, value] of urlParams.entries()) {
                    params[key] = value;
                }

                // Gọi API để verify kết quả thanh toán
                const result = await checkVNPayReturn(params);

                if (result.success) {
                    setStatus("success");
                    setMessage("Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.");

                    // Xóa discount info khỏi localStorage sau khi thanh toán thành công
                    localStorage.removeItem("cartDiscount");

                    // Chuyển hướng về trang chủ sau 3 giây
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                } else {
                    setStatus("failed");
                    setMessage("Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.");

                    // Chuyển hướng về trang giỏ hàng sau 3 giây
                    setTimeout(() => {
                        navigate("/cart");
                    }, 3000);
                }
            } catch (error) {
                console.error("Error checking payment result:", error);
                setStatus("error");
                setMessage("Có lỗi xảy ra khi kiểm tra kết quả thanh toán.");

                // Chuyển hướng về trang giỏ hàng sau 3 giây
                setTimeout(() => {
                    navigate("/cart");
                }, 3000);
            }
        };

        checkPaymentResult();
    }, [location.search, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case "success":
                return "✅";
            case "failed":
                return "❌";
            case "error":
                return "⚠️";
            default:
                return "⏳";
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "success":
                return "text-green-600 bg-green-50";
            case "failed":
                return "text-red-600 bg-red-50";
            case "error":
                return "text-yellow-600 bg-yellow-50";
            default:
                return "text-blue-600 bg-blue-50";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className={`max-w-md w-full mx-4 p-8 rounded-lg shadow-lg text-center ${getStatusColor()}`}>
                <div className="text-6xl mb-4">
                    {getStatusIcon()}
                </div>
                <h1 className="text-2xl font-bold mb-4">
                    Kết quả thanh toán
                </h1>
                <p className="text-lg mb-6">
                    {message}
                </p>
                {status === "processing" && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto"></div>
                )}
                {status !== "processing" && (
                    <div className="text-sm text-gray-600">
                        Bạn sẽ được chuyển hướng trong vài giây...
                    </div>
                )}
            </div>
        </div>
    );
}
