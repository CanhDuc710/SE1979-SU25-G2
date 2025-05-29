// src/pages/ProductList.jsx
import React from 'react';
import SidebarFilter from "../../ui/SidebarFilter.jsx";
import ProductCard from "./ProductCard.jsx";
import Pagination from "../../ui/Pagination.jsx";

export default function ProductList() {
    return (
        <>
            <main className="flex container mx-auto mt-6">
                <SidebarFilter />
                <section className="flex-1 px-6">
                    <h2 className="text-xl font-semibold mb-4">Suggest for you</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, idx) => (
                            <ProductCard key={idx} name={`Item ${idx + 1}`} price="200,000 VND" />
                        ))}
                    </div>
                    <Pagination />
                </section>
            </main>
        </>
    );
}
