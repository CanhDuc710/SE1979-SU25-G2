import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import { getNewArrivals, getSuggestedProducts } from '../../service/productService';
import {API_BASE_URL, IMAGE_BASE_URL} from "../../utils/constants.js";

export default function Homepage() {
    const [newArrivals, setNewArrivals] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);


    useEffect(() => {
        getNewArrivals().then(setNewArrivals).catch(console.error);
        getSuggestedProducts().then(setSuggestedProducts).catch(console.error);

    }, []);

    return (
        <main className="w-full bg-[#f5f5f5]">
            {/* ========== Banner Section ========== */}
            <section className="bg-[#ececec] py-20 px-4 md:px-16">
                <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
                    <div className="flex-1 text-left mb-10 md:mb-0">
                        <span className="uppercase text-sm text-orange-500 font-semibold tracking-widest">Header</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">New arrivals</h1>
                        <p className="text-gray-600 mb-6">New product he he he</p>
                        <div className="space-x-4">
                            <Link to="/products" className="inline-block px-6 py-2 border border-black rounded-full text-sm hover:bg-black hover:text-white transition">
                                Shop Now
                            </Link>
                            <button className="inline-block text-sm underline hover:text-orange-600">Watch the video</button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="w-[300px] h-[200px] md:w-[400px] md:h-[300px] bg-black rounded-xl flex items-center justify-center text-white text-xl">
                            Image
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== NEW ARRIVALS Section ========== */}
            <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">NEW ARRIVALS</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newArrivals.map((item) => (
                        <Link
                            to={`/products/${item.productId}`}
                            key={item.productId}
                            className="group border bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            <ProductCard
                                name={item.name}
                                price={item.price === 0 ? 'Contact' : `${item.price.toLocaleString()} VND`}
                                image={
                                    item.imageUrls?.[0]
                                        ? `${IMAGE_BASE_URL}${item.imageUrls[0]}`
                                        : null
                                }
                            />
                        </Link>

                    ))}

                </div>
                <div className="mt-6 text-center">
                    <Link to="/products" className="inline-block px-6 py-2 border border-orange-500 rounded-full text-sm text-orange-500 hover:bg-orange-500 hover:text-white transition">
                        View All →
                    </Link>
                </div>
            </section>

            {/* ========== SUGGESTED FOR YOU Section ========== */}
            <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Suggested for You</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {suggestedProducts.map((item) => (
                        <Link
                            to={`/products/${item.productCode}`}
                            key={item.productCode}
                            className="group border bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Image */}
                            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {item.imageUrls?.[0] ? (
                                    <img
                                        src={`${IMAGE_BASE_URL}${item.imageUrls[0]}`}
                                        alt={item.name}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{item.brand} • {item.categoryName}</p>
                                <p className="text-red-500 text-sm mt-2">
                                    {item.price === 0 ? "Contact" : `${item.price.toLocaleString()} VND`}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </main>
    );
}
