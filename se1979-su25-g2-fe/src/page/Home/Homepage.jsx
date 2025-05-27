import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';

export default function Homepage() {
    return (
        <main className="w-full bg-[#f5f5f5]">
            {/* ========== Banner Section ========== */}
            <section className="bg-[#ececec] py-20 px-4 md:px-16">
                <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
                    {/* Left content */}
                    <div className="flex-1 text-left mb-10 md:mb-0">
                        <span className="uppercase text-sm text-orange-500 font-semibold tracking-widest">Header</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">New arrivals</h1>
                        <p className="text-gray-600 mb-6">New product he he he</p>
                        <div className="space-x-4">
                            <Link
                                to="/products"
                                className="inline-block px-6 py-2 border border-black rounded-full text-sm hover:bg-black hover:text-white transition"
                            >
                                Shop Now
                            </Link>
                            <button className="inline-block text-sm underline hover:text-orange-600">Watch the video</button>
                        </div>
                    </div>

                    {/* Right image */}
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
                    {[1, 2, 3, 4].map((item) => (
                        <ProductCard key={item} name={`Item name ${item}`} price="200.000 VND" />
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Link
                        to="/products"
                        className="inline-block px-6 py-2 border border-orange-500 rounded-full text-sm text-orange-500 hover:bg-orange-500 hover:text-white transition"
                    >
                        View All →
                    </Link>
                </div>
            </section>

            {/* ========== TOP SELLING Section ========== */}
            <section className="py-10 px-4 md:px-16 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Top Selling</h2>
                    <div className="space-x-2">
                        <button className="text-xl hover:text-orange-600">←</button>
                        <button className="text-xl hover:text-orange-600">→</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <ProductCard key={item} name={`Item name ${item}`} price="200.000 VND" />
                    ))}
                </div>
            </section>
        </main>
    );
}
