import { useEffect, useState } from "react";
import { getCart, getSessionId } from "../../service/cartService";
import { createOrder, createVNPayPayment } from "../../service/orderService";
import { getProvinces, getDistricts, getWards } from "../../service/addressService";
import { orderSchema } from "../../validation/orderSchema";
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
    const [errors, setErrors] = useState({});
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

    const getDiscountInfo = () => {
        try {
            const saved = localStorage.getItem("cartDiscount");
            return saved
                ? JSON.parse(saved)
                : { discount: 0, finalTotal: cart?.totalPrice || 0 };
        } catch {
            return { discount: 0, finalTotal: cart?.totalPrice || 0 };
        }
    };

    const loadProvinces = async () => {
        try {
            const data = await getProvinces();
            setProvinces(data);
        } catch {
            setProvinces([]);
        }
    };

    const handleProvinceChange = async (provinceId) => {
        setForm((p) => ({ ...p, provinceId, districtId: "", wardId: "" }));
        setDistricts([]);
        setWards([]);
        if (provinceId) {
            try {
                const data = await getDistricts(Number(provinceId));
                setDistricts(data || []);
            } catch {
                setDistricts([]);
            }
        }
    };

    const handleDistrictChange = async (districtId) => {
        setForm((p) => ({ ...p, districtId, wardId: "" }));
        setWards([]);
        if (districtId) {
            try {
                const data = await getWards(Number(districtId));
                setWards(data || []);
            } catch {
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
            setForm((p) => ({ ...p, [name]: value }));
        }
        setErrors((e) => ({ ...e, [name]: undefined }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingOrder(true);
        setError("");
        setErrors({});

        // Validate
        try {
            await orderSchema.validate(form, { abortEarly: false });
        } catch (ve) {
            const fieldErrors = {};
            ve.inner.forEach((err) => {
                if (err.path) fieldErrors[err.path] = err.message;
            });
            setErrors(fieldErrors);
            setLoadingOrder(false);
            return;
        }

        try {
            const discountInfo = getDiscountInfo();
            const sessionId = getSessionId();

            if (!cart?.items?.length) {
                throw new Error(
                    "Cart is empty. Please add items to cart before checkout."
                );
            }

            const orderData = {
                ...form,
                provinceId: form.provinceId ? Number(form.provinceId) : null,
                districtId: form.districtId ? Number(form.districtId) : null,
                wardId: form.wardId ? Number(form.wardId) : null,
                sessionId,
                discountAmount: discountInfo.discount || 0,
                finalTotal:
                    discountInfo.finalTotal ||
                    (cart?.totalPrice || 0) + 15000,
            };

            if (form.paymentMethod === "CARD") {
                const vnpay = await createVNPayPayment(orderData);
                window.location.href = vnpay.paymentUrl;
            } else {
                await createOrder(orderData);
                setSuccess(true);
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.message ||
                "Order failed. Please check your info."
            );
        } finally {
            setLoadingOrder(false);
        }
    };

    if (loadingCart)
        return <div className="text-center p-10">Loading...</div>;

    if (success)
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="bg-white p-8 rounded shadow text-center">
                    <div className="text-3xl mb-4 text-green-600">✔️</div>
                    <div className="text-xl font-semibold mb-2">
                        Order placed successfully!
                    </div>
                    <div className="text-gray-600">
                        Thank you for your purchase.
                    </div>
                </div>
            </div>
        );

    const discountInfo = getDiscountInfo();
    const shipping = 15000;

    return (
        <div className="min-h-screen flex flex-col">
            <main className="max-w-5xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
                {/* Order Review */}
                <div className="md:w-2/3">
                    <h1 className="text-2xl font-semibold mb-8">Order Review</h1>
                    <div className="space-y-6 mb-10">
                        {cart?.items?.map((item) => (
                            <div
                                key={item.variantId}
                                className="flex items-center justify-between border-b pb-4"
                            >
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
                            <span>
                {discountInfo.discount > 0
                    ? `-${discountInfo.discount.toLocaleString()} VND`
                    : "0 VND"}
              </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping</span>
                            <span>{shipping.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between mt-4 font-bold text-lg">
                            <span>Final Total</span>
                            <span>{discountInfo.finalTotal.toLocaleString()} VND</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Form */}
                <form
                    onSubmit={handleSubmit}
                    className="md:w-1/3 bg-white p-8 rounded-lg shadow space-y-5 h-fit"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Shipping Info
                    </h2>
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
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
                                errors.shippingName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.shippingName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.shippingName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Phone</label>
                        <input
                            name="shippingPhone"
                            value={form.shippingPhone}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
                                errors.shippingPhone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.shippingPhone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.shippingPhone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Address</label>
                        <input
                            name="shippingAddress"
                            value={form.shippingAddress}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
                                errors.shippingAddress
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.shippingAddress && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.shippingAddress}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Province</label>
                            <select
                                name="provinceId"
                                value={form.provinceId}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded ${
                                    errors.provinceId
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select</option>
                                {provinces.map((p) => (
                                    <option
                                        key={p.provinceId}
                                        value={String(p.provinceId)}
                                    >
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            {errors.provinceId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.provinceId}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1 font-medium">District</label>
                            <select
                                name="districtId"
                                value={form.districtId}
                                onChange={handleChange}
                                disabled={!form.provinceId}
                                className={`w-full p-2 border rounded ${
                                    errors.districtId
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select</option>
                                {districts.map((d) => (
                                    <option
                                        key={d.districtId}
                                        value={String(d.districtId)}
                                    >
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            {errors.districtId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.districtId}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Ward</label>
                            <select
                                name="wardId"
                                value={form.wardId}
                                onChange={handleChange}
                                disabled={!form.districtId}
                                className={`w-full p-2 border rounded ${
                                    errors.wardId
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select</option>
                                {wards.map((w) => (
                                    <option key={w.wardId} value={String(w.wardId)}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                            {errors.wardId && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.wardId}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${
                                errors.paymentMethod
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="CARD">Bank Transfer</option>
                        </select>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.paymentMethod}
                            </p>
                        )}
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
