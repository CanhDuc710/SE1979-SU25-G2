import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../service/cartService";
import { createOrder, createVNPayPayment } from "../../service/orderService";
import { getProvinces, getDistricts, getWards, getDefaultAddress } from "../../service/addressService";
import { fetchProfile } from "../../service/profileService";
import { getSessionId } from "../../service/cartService";
import { orderSchema } from "../../validation/orderSchema";

import { IMAGE_BASE_URL } from "../../utils/constants";

export default function OrderPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [form, setForm] = useState({
        shippingName: "",
        shippingPhone: "",
        shippingAddress: "",
        provinceId: "",
        districtId: "",
        wardId: "",
        paymentMethod: "COD",
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingUserData, setLoadingUserData] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const initializePage = async () => {
            await loadCart();
            await loadProvinces();
            await checkUserAndAutoFill();
        };
        initializePage();
    }, []);

    // Thêm useEffect để kiểm tra cart trống và redirect về cart page
    useEffect(() => {
        if (!loadingCart && cart) {
            // Kiểm tra cart có trống không
            if (!cart.items || cart.items.length === 0) {
                console.log("Cart is empty, redirecting to cart page");
                navigate("/cart", { replace: true });
                return;
            }
        }
    }, [cart, loadingCart, navigate]);

    // Check if user is logged in and auto-fill information
    const checkUserAndAutoFill = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setLoadingUserData(true);
            try {
                // Load user profile
                const profile = await fetchProfile();

                // Load default address
                const defaultAddress = await getDefaultAddress();

                if (defaultAddress) {
                    // Set basic form data first
                    setForm(prev => ({
                        ...prev,
                        shippingName: defaultAddress.recipientName || `${profile.firstName} ${profile.lastName}`,
                        shippingPhone: defaultAddress.recipientPhone || profile.phoneNumber,
                        shippingAddress: defaultAddress.addressLine || "",
                    }));

                    // Load districts and wards for the default address
                    if (defaultAddress.provinceId) {
                        try {
                            // Set province first
                            setForm(prev => ({
                                ...prev,
                                provinceId: defaultAddress.provinceId?.toString() || "",
                            }));

                            // Load districts for the province
                            const districtsData = await getDistricts(defaultAddress.provinceId);
                            setDistricts(districtsData);

                            if (defaultAddress.districtId) {
                                // Set district
                                setForm(prev => ({
                                    ...prev,
                                    districtId: defaultAddress.districtId?.toString() || "",
                                }));

                                // Load wards for the district
                                const wardsData = await getWards(defaultAddress.districtId);
                                setWards(wardsData);

                                if (defaultAddress.wardId) {
                                    // Set ward
                                    setForm(prev => ({
                                        ...prev,
                                        wardId: defaultAddress.wardId?.toString() || "",
                                    }));
                                }
                            }
                        } catch (error) {
                            console.error("Error loading location data:", error);
                        }
                    }
                } else {
                    // No default address, just fill name and phone from profile
                    setForm(prev => ({
                        ...prev,
                        shippingName: `${profile.firstName} ${profile.lastName}`,
                        shippingPhone: profile.phoneNumber || "",
                    }));
                }
            } catch (error) {
                console.error("Error loading user data for auto-fill:", error);
                // Continue without auto-fill if there's an error
            } finally {
                setLoadingUserData(false);
            }
        }
    };

    const loadCart = async () => {
        setLoadingCart(true);
        const data = await getCart();
        setCart(data);
        setLoadingCart(false);
    };

    // Lấy discount info từ localStorage và tính toán lại CHÍNH XÁC như CartPage
    const getDiscountInfo = () => {
        try {
            const saved = localStorage.getItem("cartDiscount");
            const savedDiscount = saved ? JSON.parse(saved) : null;

            console.log("Saved discount from localStorage:", savedDiscount);
            console.log("Current cart:", cart);

            // KIỂM TRA CART RỖNG TRƯỚC - nếu cart rỗng thì xóa discount luôn
            const currentCartTotal = cart?.totalPrice || 0;
            const hasItems = cart?.items && cart.items.length > 0;

            if (!hasItems || currentCartTotal === 0) {
                console.log("Cart is empty, removing any existing discount");
                if (savedDiscount) {
                    localStorage.removeItem("cartDiscount");
                }
                return {
                    discount: 0,
                    finalTotal: 15000 // chỉ có phí ship
                };
            }

            // Nếu không có discount được lưu, trả về giá trị mặc định
            if (!savedDiscount || !savedDiscount.discount) {
                console.log("No discount found, returning default values");
                return {
                    discount: 0,
                    finalTotal: currentCartTotal + 15000 // cart total + shipping
                };
            }

            // CHỈ kiểm tra nếu cart thay đổi QUÁ NHIỀU (hơn 50%) thì mới xóa discount
            if (savedDiscount.appliedCartTotal && currentCartTotal > 0) {
                const changePercentage = Math.abs(currentCartTotal - savedDiscount.appliedCartTotal) / savedDiscount.appliedCartTotal;
                console.log("Cart change percentage:", changePercentage);

                if (changePercentage > 0.5) { // Tăng từ 0.1 lên 0.5 (50%)
                    console.log("Cart changed significantly (>50%), removing discount");
                    localStorage.removeItem("cartDiscount");
                    return {
                        discount: 0,
                        finalTotal: currentCartTotal + 15000
                    };
                }
            }

            // Tính discount dựa trên thông tin đã lưu
            let discountAmount;
            if (savedDiscount.discountPercent && savedDiscount.maxDiscountAmount) {
                // Tính lại discount dựa trên cart hiện tại
                discountAmount = Math.min(
                    Math.round(currentCartTotal * (savedDiscount.discountPercent / 100)),
                    savedDiscount.maxDiscountAmount
                );
            } else {
                // Fallback: sử dụng discount đã tính sẵn
                discountAmount = savedDiscount.discount;
            }

            const shipping = 15000;
            const calculatedFinalTotal = currentCartTotal - discountAmount + shipping;

            console.log("Calculated discount:", discountAmount);
            console.log("Calculated final total:", calculatedFinalTotal);

            return {
                discount: discountAmount,
                finalTotal: calculatedFinalTotal
            };
        } catch (error) {
            console.error("Error calculating discount:", error);
            return {
                discount: 0,
                finalTotal: (cart?.totalPrice || 0) + 15000
            };
        }
    };

    const loadProvinces = async () => {
        try {
            const data = await getProvinces();
            setProvinces(data);
        } catch (error) {
            console.error("Error loading provinces:", error);
            setProvinces([]);
        }
    };

    const handleProvinceChange = async (provinceId) => {
        // Update form first
        setForm((prev) => ({
            ...prev,
            provinceId,
            districtId: "",
            wardId: "",
        }));

        // Reset dependent data
        setDistricts([]);
        setWards([]);

        if (provinceId && !isNaN(Number(provinceId))) {
            try {
                console.log(`Fetching districts for province: ${provinceId}`);
                const data = await getDistricts(parseInt(provinceId, 10));
                console.log("Districts received:", data);
                setDistricts(data || []);
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]);
            }
        }
    };

    const handleDistrictChange = async (districtId) => {
        // Update form first
        setForm((prev) => ({
            ...prev,
            districtId,
            wardId: "",
        }));

        // Reset wards
        setWards([]);

        if (districtId && !isNaN(Number(districtId))) {
            try {
                console.log(`Fetching wards for district: ${districtId}`);
                const data = await getWards(parseInt(districtId, 10));
                console.log("Wards received:", data);
                setWards(data || []);
            } catch (error) {
                console.error("Error fetching wards:", error);
                setWards([]);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "provinceId") {
            handleProvinceChange(value);
        } else if (name === "districtId") {
            handleDistrictChange(value);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingOrder(true);
        setError("");
        setFormErrors({});

        try {
            // validate bằng yup
            await orderSchema.validate(form, { abortEarly: false });

            const discountInfo = getDiscountInfo();
            const sessionId = getSessionId();

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error("Cart is empty. Please add items to cart before checkout.");
            }

            const getUserIdFromToken = () => {
                const token = localStorage.getItem('token');
                if (!token) return null;
                try {
                    const payloadBase64 = token.split('.')[1];
                    const payload = JSON.parse(atob(payloadBase64));
                    return payload.id || payload.sub;
                } catch (e) {
                    console.error("Error parsing JWT token:", e);
                    return null;
                }
            };

            const userId = getUserIdFromToken();

            const orderData = {
                ...form,
                userId: userId,
                provinceId: parseInt(form.provinceId, 10),
                districtId: parseInt(form.districtId, 10),
                wardId: parseInt(form.wardId, 10),
                sessionId,
                discountAmount: discountInfo.discount || 0,
                finalTotal: discountInfo.finalTotal || (cart?.totalPrice || 0) + 15000
            };

            if (form.paymentMethod === "CARD") {
                const vnpayResponse = await createVNPayPayment(orderData);
                localStorage.removeItem("cartDiscount");
                window.location.href = vnpayResponse.paymentUrl;
            } else {
                await createOrder(orderData);
                localStorage.removeItem("cartDiscount");
                setSuccess(true);
            }

        } catch (err) {
            if (err.name === "ValidationError") {
                const fieldErrors = {};
                err.inner.forEach((e) => {
                    fieldErrors[e.path] = e.message;
                });
                setFormErrors(fieldErrors);
            } else {
                setError(err.response?.data?.error || err.message || "Đặt hàng thất bại.");
            }
        }

        setLoadingOrder(false);
    };


    if (loadingCart || loadingUserData) return <div className="text-center p-10">Loading...</div>;

    if (success)
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center bg-green-50">
                    <div className="bg-white p-8 rounded shadow text-center">
                        <div className="text-3xl mb-4 text-green-600">✔️</div>
                        <div className="text-xl font-semibold mb-2">Mua hàng thành công!</div>
                        <div className="text-gray-600">Cảm ơn bạn đã mua hàng</div>
                    </div>
                </main>
            </div>
        );

    const discountInfo = getDiscountInfo();
    const totalPrice = cart?.totalPrice || 0;
    const discount = discountInfo.discount;
    const shipping = 15000;
    const finalTotal = discountInfo.finalTotal; // Không cộng thêm shipping vì đã có trong discountInfo.finalTotal

    return (
        <div className="min-h-screen flex flex-col">
            <main className="max-w-5xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
                <div className="md:w-2/3">
                    <h1 className="text-2xl font-semibold mb-8">Tổng quan đơn hàng</h1>

                    {isLoggedIn && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="text-blue-600 mr-2">ℹ️</div>
                                <div className="text-blue-800">
                                    <p className="font-medium">Thông tin đã được tự động điền</p>
                                    <p className="text-sm">Thông tin giao hàng được lấy từ địa chỉ mặc định của bạn. Bạn có thể chỉnh sửa nếu cần.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cart Items */}
                    <div className="space-y-6 mb-10">
                        {cart?.items?.map((item) => (
                            <div key={item.variantId} className="flex items-center justify-between border-b pb-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-gray-100 flex justify-center items-center overflow-hidden rounded">
                                        {item.imageUrl ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}${item.imageUrl}`}
                                                alt={item.productName}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-4xl">🖼️</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold">{item.productName}</div>
                                        <div className="text-sm text-gray-600">
                                            Size: {item.size} | Color: {item.color}
                                        </div>
                                        <div>{item.price.toLocaleString()} VND</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>x{item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg max-w-md ml-auto">
                        <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
                        <div className="flex justify-between mb-2">
                            <span>Tổng cộng</span>
                            <span>{totalPrice.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mb-2 text-red-500">
                            <span>Giảm giá</span>
                            <span>-{discount.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Phí vận chuyển</span>
                            <span>{shipping.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mt-4 font-bold text-lg">
                            <span>Thành tiền</span>
                            <span>{finalTotal.toLocaleString()} VND</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="md:w-1/3 bg-white p-8 rounded-lg shadow space-y-5 h-fit">
                    <h2 className="text-2xl font-bold mb-4 text-center">Shipping Info</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            name="shippingName"
                            value={form.shippingName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {formErrors.shippingName && <p className="text-red-500 text-sm">{formErrors.shippingName}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Phone</label>
                        <input
                            name="shippingPhone"
                            value={form.shippingPhone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {formErrors.shippingPhone && <p className="text-red-500 text-sm">{formErrors.shippingPhone}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Address</label>
                        <input
                            name="shippingAddress"
                            value={form.shippingAddress}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {formErrors.shippingAddress && <p className="text-red-500 text-sm">{formErrors.shippingAddress}</p>}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Tỉnh</label>
                            <select
                                name="provinceId"
                                value={form.provinceId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select</option>
                                {provinces.map((p) => (
                                    <option key={p.provinceId} value={String(p.provinceId)}>{p.name}</option>
                                ))}
                            </select>
                            {formErrors.provinceId && <p className="text-red-500 text-sm">{formErrors.provinceId}</p>}
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Quận</label>
                            <select
                                name="districtId"
                                value={form.districtId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                disabled={!form.provinceId}
                            >
                                <option value="">Select</option>
                                {districts.map((d) => (
                                    <option key={d.districtId} value={String(d.districtId)}>{d.name}</option>
                                ))}
                            </select>
                            {formErrors.districtId && <p className="text-red-500 text-sm">{formErrors.districtId}</p>}
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Phường</label>
                            <select
                                name="wardId"
                                value={form.wardId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                disabled={!form.districtId}
                            >
                                <option value="">Select</option>
                                {wards.map((w) => (
                                    <option key={w.wardId} value={String(w.wardId)}>{w.name}</option>
                                ))}
                            </select>
                            {formErrors.wardId && <p className="text-red-500 text-sm">{formErrors.wardId}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Phương thức thanh toán</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="COD">Thanh toán khi nhận hàng</option>
                            <option value="CARD">VNPay</option>
                        </select>
                        {formErrors.paymentMethod && <p className="text-red-500 text-sm">{formErrors.paymentMethod}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loadingOrder}
                        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition"
                    >
                        {loadingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                </form>
            </main>
        </div>
    );
}
