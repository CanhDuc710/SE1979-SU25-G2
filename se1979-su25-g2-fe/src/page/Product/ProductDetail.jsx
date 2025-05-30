import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductDetail } from "../../service/productService"; // Chuẩn như ProductList
import Header from "../../ui/Header";
import Footer from "../../ui/Footer";
import { IMAGE_BASE_URL } from "../../utils/constants";

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProductDetail(productId)
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [productId]);

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
                    <div className="text-lg text-red-500">Product not found.</div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <main className="max-w-5xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
                {/* Product Image */}
                <div className="md:w-1/2 flex justify-center items-start">
                    <div className="w-72 h-72 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                        {product.imageUrls && product.imageUrls[0] ? (
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
                        <span className="text-2xl font-semibold text-red-500">
                            {product.price && product.price !== 0
                                ? product.price.toLocaleString() + " VND"
                                : "Contact"}
                        </span>
                    </div>
                    <div className="text-gray-700 mb-6">{product.description}</div>

                    <div className="mb-8">
                        <h3 className="font-bold text-xl mb-2">Product Details:</h3>
                        <ul className="list-disc ml-5 space-y-1 text-gray-700">
                            <li>
                                <b>Category:</b> {product.categoryName}
                            </li>
                            <li>
                                <b>Brand:</b> {product.brand}
                            </li>
                            <li>
                                <b>Material:</b> {product.material}
                            </li>
                            <li>
                                <b>Gender:</b> {product.gender}
                            </li>
                            <li>
                                <b>Status:</b> {product.isActive ? "Available" : "Unavailable"}
                            </li>
                        </ul>
                    </div>
                    {/* Add to Cart button */}
                    <div className="flex items-center gap-4">
                        <button className="bg-black text-white px-8 py-3 rounded-xl text-base font-semibold shadow hover:bg-gray-800 transition">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
