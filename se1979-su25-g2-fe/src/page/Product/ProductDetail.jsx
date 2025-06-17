import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductDetail, getSuggestedProducts } from "../../service/productService";
import { addToCart } from "../../service/cartService";
import Header from "../../ui/Header";
import Footer from "../../ui/Footer";
import { IMAGE_BASE_URL } from "../../utils/constants";
import colorMap from "../../utils/colorMap.js";

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [suggestions, setSuggestions] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        getSuggestedProducts().then(setSuggestions);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex(prev => (prev + 1) % Math.ceil(suggestions.length / 4));
        }, 3000);
        return () => clearInterval(interval);
    }, [suggestions]);

    useEffect(() => {
        setLoading(true);
        getProductDetail(productId)
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [productId]);

    const colors = [...new Set(product?.variants?.map(v => v.color))];
    const sizes = [...new Set(product?.variants?.map(v => v.size))];

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex justify-center items-center">
                    <div className="text-lg">Loading...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex justify-center items-center">
                    <div className="text-lg text-red-500">Không tìm thấy sản phẩm</div>
                </main>
                <Footer />
            </>
        );
    }

    const handleAddToCart = async () => {
        const variant = product.variants.find(
            (v) => v.color === selectedColor && v.size === selectedSize
        );
        if (variant) {
            await addToCart(variant.variantId, quantity);
            alert("Đã thêm vào giỏ hàng!");
        } else {
            alert("Vui lòng chọn đúng biến thể!");
        }
    };

    return (
        <>
            <main className="max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
                {/* Product Image */}
                <div className="md:w-1/2 flex justify-center items-start">
                    <div className="w-72 h-72 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                        {product.imageUrls?.[0] ? (
                            <img
                                src={`${IMAGE_BASE_URL}${product.imageUrls[0]}`}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-400 text-6xl">🖼️</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 flex flex-col justify-start">
                    <h2 className="text-3xl font-bold mb-3">{product.name}</h2>

                    <div className="flex items-end gap-4 mb-4">
                        <span className="text-2xl font-semibold text-black">
                            {product.price ? product.price.toLocaleString() + " VND" : "Liên hệ"}
                        </span>
                        <span className="text-gray-400 line-through">300.000 VND</span>
                        <span className="text-red-500 font-medium">-40%</span>
                    </div>

                    {/* Select Color */}
                    <div className="flex gap-2 mb-4">
                        {colors.map(color => {
                            const bgColor = colorMap[color] || "#ccc";
                            return (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 ${
                                        selectedColor === color ? "border-black" : "border-gray-300"
                                    }`}
                                    style={{ backgroundColor: bgColor }}
                                    title={color}
                                ></button>
                            );
                        })}
                    </div>

                    {/* Select Size */}
                    <div className="mb-6">
                        <p className="font-medium mb-2">Chọn Size</p>
                        <div className="flex gap-2">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3 py-1 rounded border ${
                                        selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Add to cart */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center border rounded">
                            <button
                                className="px-3 py-1"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button className="px-3 py-1" onClick={() => setQuantity(q => q + 1)}>
                                +
                            </button>
                        </div>
                        <button
                            className="bg-black text-white px-8 py-3 rounded-xl text-base font-semibold shadow hover:bg-gray-800 transition"
                            onClick={handleAddToCart}
                            disabled={!selectedColor || !selectedSize}
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Product Detail */}
                    <div>
                        <h3 className="font-bold text-xl mb-2">Chi tiết sản phẩm:</h3>
                        <ul className="list-disc ml-5 space-y-1 text-gray-700">
                            <li><b>Chất liệu:</b> {product.material}</li>
                            <li><b>Thương hiệu:</b> {product.brand}</li>
                            <li><b>Kiểu áo:</b> {product.categoryName}</li>
                            <li><b>Giới tính:</b> {product.gender}</li>
                            <li><b>Màu sắc có sẵn:</b> {colors.join(", ")}</li>
                            <li><b>Kích thước:</b> {sizes.join(", ")}</li>
                        </ul>
                    </div>

                    {product.description && (
                        <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    )}
                </div>
            </main>

            <div className="mt-16 px-4 max-w-6xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Có thể bạn cũng thích</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
                    {suggestions
                        .slice(slideIndex * 4, slideIndex * 4 + 4)
                        .map((item) => (
                            <div
                                key={item.productId}
                                className="border rounded-md p-2 hover:shadow"
                            >
                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                                    {item.imageUrls?.[0] ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}${item.imageUrls[0]}`}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-4xl text-gray-300">🖼️</span>
                                    )}
                                </div>
                                <div className="text-sm font-medium">{item.name}</div>
                                <div className="text-gray-500 text-sm">
                                    {item.price > 0
                                        ? item.price.toLocaleString() + " VND"
                                        : "Liên hệ"}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
