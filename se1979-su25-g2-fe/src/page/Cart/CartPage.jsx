import { useEffect, useState } from "react";
import {
    getCart,
    updateCartItem,
    removeFromCart,
} from "../../service/cartService";
import { IMAGE_BASE_URL } from "../../utils/constants";
import Header from "../../ui/Header.jsx";
import Footer from "../../ui/Footer.jsx";


export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        setLoading(true);
        const data = await getCart();
        setCart(data);
        setLoading(false);
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

    if (loading) return <div className="text-center p-10">Loading...</div>;

    const totalPrice = cart?.totalPrice || 0;
    const discount = totalPrice * 0.2;
    const shipping = 15000;
    const finalTotal = totalPrice - discount + shipping;

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
                        <span>Giảm giá (-20%)</span>
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

                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition">
                            Áp dụng
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
                        Thanh toán →
                    </button>
                </div>
            </main>
        </>
    );
}
