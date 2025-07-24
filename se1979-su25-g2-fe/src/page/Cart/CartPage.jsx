import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCart,
    updateCartItem,
    removeFromCart,
} from "../../service/cartService";
import { fetchDiscounts } from "../../service/discountService";
import { IMAGE_BASE_URL } from "../../utils/constants";


export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [discountCode, setDiscountCode] = useState("");
    const [discounts, setDiscounts] = useState([]);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountError, setDiscountError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
        loadDiscounts();
    }, []);

    const loadCart = async () => {
        setLoading(true);
        const data = await getCart();
        setCart(data);
        setLoading(false);
    };

    const loadDiscounts = async () => {
        try {
            const data = await fetchDiscounts({ page: 0, size: 100 });
            setDiscounts(data.content || []);
        } catch (error) {
            setDiscounts([]);
        }
    };

    const handleQuantityChange = async (variantId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(variantId, newQuantity);
        loadCart();
    };

    const handleRemoveItem = async (variantId) => {
        await removeFromCart(variantId);
        loadCart();
    };

    const handleApplyDiscount = () => {
        setDiscountError("");
        setAppliedDiscount(null);
        if (!discountCode) {
            setDiscountError("Please enter a discount code.");
            return;
        }
        const found = discounts.find(
            d => d.code.toLowerCase() === discountCode.trim().toLowerCase() && d.isActive
        );
        if (!found) {
            setDiscountError("Invalid or inactive discount code.");
            return;
        }
        if (cart?.totalPrice < found.minOrderValue) {
            setDiscountError(`Order must be at least ${found.minOrderValue.toLocaleString()} VND to use this code.`);
            return;
        }
        setAppliedDiscount(found);

        // Lưu discount info ngay khi apply thành công
        const calculatedDiscount = Math.min(
            Math.round((cart?.totalPrice || 0) * (found.discountPercent / 100)),
            found.maxDiscountAmount
        );
        const calculatedFinalTotal = (cart?.totalPrice || 0) - calculatedDiscount + 15000; // Thêm shipping vào đây
        localStorage.setItem("cartDiscount", JSON.stringify({
            discount: calculatedDiscount,
            finalTotal: calculatedFinalTotal
        }));
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;

    // Tính toán discount và finalTotal
    const totalPrice = cart?.totalPrice || 0;
    const discount = appliedDiscount
        ? Math.min(
            Math.round(totalPrice * (appliedDiscount.discountPercent / 100)),
            appliedDiscount.maxDiscountAmount
        )
        : 0;
    const shipping = 15000;
    const finalTotal = totalPrice - discount + shipping; // Thêm shipping vào finalTotal

    return (
        <>
            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-semibold mb-8">Giỏ hàng của bạn</h1>

                <div className="space-y-6 mb-10">
                    {cart?.items?.map((item) => (
                        <div
                            key={item.variantId}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            <div className="flex gap-4 items-center">
                                <div
                                    className="w-20 h-20 bg-gray-100 flex justify-center items-center overflow-hidden rounded">
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
                                        Size: {item.size} | Màu: {item.color}
                                    </div>
                                    <div>{item.price.toLocaleString()} VND</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-2 border"
                                    onClick={() =>
                                        handleQuantityChange(item.variantId, item.quantity - 1)
                                    }
                                >
                                    −
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="px-2 border"
                                    onClick={() =>
                                        handleQuantityChange(item.variantId, item.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                                <button
                                    className="text-red-500 ml-4"
                                    onClick={() => handleRemoveItem(item.variantId)}
                                >
                                    🗑️
                                </button>
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
                        <span>Giảm giá {appliedDiscount ? `(-${appliedDiscount.discountPercent}%)` : ""}</span>
                        <span>{discount.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Phí vận chuyển</span>
                        <span>{shipping.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between mt-4 font-bold text-lg">
                        <span>Thành tiền</span>
                        <span>{finalTotal.toLocaleString()} VND</span>
                    </div>
                    {/* Discount code input */}
                    <div className="mt-4">
                        <label className="block mb-1 font-medium">Mã giảm giá</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={discountCode}
                                onChange={e => setDiscountCode(e.target.value)}
                                className="flex-1 p-2 border rounded"
                                placeholder="Nhập mã"
                            />
                            <button
                                type="button"
                                onClick={handleApplyDiscount}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Áp dụng
                            </button>
                        </div>
                        {discountError && <div className="text-red-500 text-xs mt-1">{discountError}</div>}
                        {appliedDiscount && (
                            <div className="text-green-600 text-xs mt-1">
                                Mã <b>{appliedDiscount.code}</b> đã được áp dụng: {appliedDiscount.discountPercent}% giảm giá (tối đa {appliedDiscount.maxDiscountAmount.toLocaleString()} VND)
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button
                        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                        onClick={() => navigate("/order")}
                    >
                        Thanh toán →
                    </button>
                </div>
            </main>
        </>
    );
}
