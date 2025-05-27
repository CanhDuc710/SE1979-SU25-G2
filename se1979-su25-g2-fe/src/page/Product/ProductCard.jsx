import React from 'react';

// src/components/ProductCard.jsx
export default function ProductCard({ name, price }) {
    return (
        <div className="border rounded p-4 hover:shadow transition bg-white">
            <div className="w-full h-48 bg-gray-200 mb-4 flex items-center justify-center">Image</div>
            <h3 className="text-sm font-semibold mb-1">{name}</h3>
            <p className="text-red-500 text-sm">{price}</p>
        </div>
    );
}
