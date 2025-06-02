import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import { getNewArrivals, getSuggestedProducts, getProductById } from '../../service/productService';
import { API_BASE_URL, IMAGE_BASE_URL } from '../../utils/constants';
import axios from 'axios';

export default function Homepage() {
    const [newArrivals, setNewArrivals] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [collectionProducts, setCollectionProducts] = useState({});

    useEffect(() => {
        getNewArrivals().then(setNewArrivals).catch(console.error);
        getSuggestedProducts().then(setSuggestedProducts).catch(console.error);

        axios.get(`${API_BASE_URL}/collections`).then(async (res) => {
            const data = res.data;
            setCollections(data);

            const productMap = {};
            for (const col of data) {
                const promises = col.productIds.map((id) => getProductById(id));
                const products = await Promise.all(promises);
                productMap[col.id] = products;
            }
            setCollectionProducts(productMap);
        });
    }, []);

    return (
        <main className="w-full bg-[#fffdf8] font-sans">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-yellow-50 to-orange-100 py-24 px-6 md:px-16 shadow-inner">
                <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
                    <div className="flex-1 text-left mb-10 md:mb-0">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-4 animate-fadeInUp">
                            WE Store
                        </h1>
                        <p className="text-lg text-gray-600 mb-6 max-w-xl animate-fadeInUp">
                            Thời trang hiện đại, chất lượng cao, truyền cảm hứng phong cách riêng biệt.
                        </p>
                        <div className="space-x-4 animate-fadeInUp">
                            <Link to="/products" className="px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition">
                                Mua ngay
                            </Link>
                            <button className="text-sm underline hover:text-orange-600 transition">Nhận tư vấn</button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img
                            src="/images/hero-main.jpg"
                            alt="Hero"
                            className="rounded-2xl shadow-2xl w-[320px] h-[240px] md:w-[500px] md:h-[360px] object-cover animate-fadeInUp"
                        />
                    </div>
                </div>
            </section>

            {/* Collections */}
            {collections.map((col) => (
                <section key={col.id} className="py-20 px-6 md:px-16 max-w-7xl mx-auto animate-fadeInUp">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{col.name}</h2>
                        <p className="text-gray-600 mb-6 italic">{col.description}</p>
                        <img
                            src={`${IMAGE_BASE_URL}${col.bannerUrl}`}
                            alt={col.name}
                            className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-xl mb-8"
                        />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {(collectionProducts[col.id] || []).map((item) => (
                            <Link
                                to={`/products/${item.productId}`}
                                key={item.productId}
                                className="group border bg-white rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                                <ProductCard
                                    name={item.name}
                                    price={item.price === 0 ? 'Contact' : `${item.price.toLocaleString()} VND`}
                                    image={item.imageUrls?.[0] ? `${IMAGE_BASE_URL}${item.imageUrls[0]}` : null}
                                />
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            {/* New Arrivals */}
            <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto animate-fadeInUp">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Sản phẩm mới về</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {newArrivals.map((item) => (
                        <Link
                            to={`/products/${item.productId}`}
                            key={item.productId}
                            className="group border bg-white rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105"
                        >
                            <ProductCard
                                name={item.name}
                                price={item.price === 0 ? 'Contact' : `${item.price.toLocaleString()} VND`}
                                image={item.imageUrls?.[0] ? `${IMAGE_BASE_URL}${item.imageUrls[0]}` : null}
                            />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Suggestions */}
            <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto animate-fadeInUp">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Gợi ý dành cho bạn</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {suggestedProducts.map((item) => (
                        <Link
                            to={`/products/${item.productId}`}
                            key={item.productId}
                            className="group border bg-white rounded-xl overflow-hidden hover:shadow-xl transition-transform transform hover:scale-105"
                        >
                            <ProductCard
                                name={item.name}
                                price={item.price === 0 ? 'Contact' : `${item.price.toLocaleString()} VND`}
                                image={item.imageUrls?.[0] ? `${IMAGE_BASE_URL}${item.imageUrls[0]}` : null}
                            />
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
