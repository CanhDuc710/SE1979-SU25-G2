import { useEffect, useState } from "react";
import { getCart } from "../../service/cartService";
import { createOrder, createVNPayPayment } from "../../service/orderService";
import { getProvinces, getDistricts, getWards } from "../../service/addressService";
import { getSessionId } from "../../service/cartService";
import Header from "../../ui/Header";
import Footer from "../../ui/Footer";
import { IMAGE_BASE_URL } from "../../utils/constants";

export default function OrderPage() {
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

    useEffect(() => {
        loadCart();
        loadProvinces();
    }, []);

    const loadCart = async () => {
        setLoadingCart(true);
        const data = await getCart();
        setCart(data);
        setLoadingCart(false);
    };

    // Lấy discount info từ localStorage
    const getDiscountInfo = () => {
        try {
            const saved = localStorage.getItem("cartDiscount");
            return saved ? JSON.parse(saved) : { discount: 0, finalTotal: cart?.totalPrice || 0 };
        } catch {
            return { discount: 0, finalTotal: cart?.totalPrice || 0 };
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

        try {
            const discountInfo = getDiscountInfo();
            const sessionId = getSessionId();

            console.log("Session ID:", sessionId);
            console.log("Discount Info:", discountInfo);
            console.log("Cart:", cart);

            // Kiểm tra cart có items không
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error("Cart is empty. Please add items to cart before checkout.");
            }

            const orderData = {
                ...form,
                provinceId: form.provinceId ? parseInt(form.provinceId, 10) : null,
                districtId: form.districtId ? parseInt(form.districtId, 10) : null,
                wardId: form.wardId ? parseInt(form.wardId, 10) : null,
                sessionId: sessionId,
                // Thêm thông tin discount
                discountAmount: discountInfo.discount || 0,
                finalTotal: discountInfo.finalTotal || (cart?.totalPrice || 0) + 15000
            };

            console.log("Order data being sent:", orderData);

            if (form.paymentMethod === "CARD") {
                // Sử dụng VNPay cho thanh toán CARD
                console.log("Creating VNPay payment...");
                const vnpayResponse = await createVNPayPayment(orderData);
                console.log("VNPay response:", vnpayResponse);
                // Chuyển hướng đến VNPay
                window.location.href = vnpayResponse.paymentUrl;
            } else {
                // Thanh toán COD thông thường
                console.log("Creating COD order...");
                await createOrder(orderData);
                setSuccess(true);
            }
        } catch (err) {
            console.error("Order error:", err);
            setError(err.response?.data?.error || err.message || "Order failed. Please check your info.");
        }

        setLoadingOrder(false);
    };

    if (loadingCart) return <div className="text-center p-10">Loading...</div>;

    if (success)
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center bg-green-50">
                    <div className="bg-white p-8 rounded shadow text-center">
                        <div className="text-3xl mb-4 text-green-600">✔️</div>
                        <div className="text-xl font-semibold mb-2">Order placed successfully!</div>
                        <div className="text-gray-600">Thank you for your purchase.</div>
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
                    <h1 className="text-2xl font-semibold mb-8">Order Review</h1>
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
                        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                        <div className="flex justify-between mb-2">
                            <span>Total (after discount)</span>
                            <span>{discountInfo.finalTotal.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mb-2 text-red-500">
                            <span>Discount</span>
                            <span>{discount > 0 ? `-${discount.toLocaleString()} VND` : "0 VND"}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping</span>
                            <span>{shipping.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mt-4 font-bold text-lg">
                            <span>Final Total</span>
                            <span>{finalTotal.toLocaleString()} VND</span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="md:w-1/3 bg-white p-8 rounded-lg shadow space-y-5 h-fit"
                >
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
                            required
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${form.shippingName ? '' : 'border-red-500'}`}
                        />
                        {!form.shippingName && <div className="text-red-500 text-xs mt-1">Name is required</div>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Phone</label>
                        <input
                            name="shippingPhone"
                            value={form.shippingPhone}
                            onChange={handleChange}
                            required
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${form.shippingPhone ? '' : 'border-red-500'}`}
                        />
                        {!form.shippingPhone && <div className="text-red-500 text-xs mt-1">Phone is required</div>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Address</label>
                        <input
                            name="shippingAddress"
                            value={form.shippingAddress}
                            onChange={handleChange}
                            required
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${form.shippingAddress ? '' : 'border-red-500'}`}
                        />
                        {!form.shippingAddress && <div className="text-red-500 text-xs mt-1">Address is required</div>}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Province</label>
                            <select
                                name="provinceId"
                                value={form.provinceId}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select</option>
                                {provinces.map((p) => (
                                    <option key={p.provinceId} value={String(p.provinceId)}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">District</label>
                            <select
                                name="districtId"
                                value={form.districtId}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                                disabled={!form.provinceId}
                            >
                                <option value="">Select</option>
                                {districts.map((d) => (
                                    <option key={d.districtId} value={String(d.districtId)}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Ward</label>
                            <select
                                name="wardId"
                                value={form.wardId}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                                disabled={!form.districtId}
                            >
                                <option value="">Select</option>
                                {wards.map((w) => (
                                    <option key={w.wardId} value={String(w.wardId)}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="CARD">Bank Transfer</option>
                        </select>
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

