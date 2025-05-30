import React, { useState } from 'react';

export default function SidebarFilter({ onFilterChange }) {
    const [brand, setBrand] = useState('');
    const [gender, setGender] = useState('');
    const [material, setMaterial] = useState('');

    const applyFilters = () => {
        onFilterChange({
            brand,
            gender,
            material,
        });
    };

    return (
        <aside className="w-64 pr-4 border-r space-y-4">
            <div>
                <h3 className="font-bold mb-2">Brand</h3>
                <select onChange={(e) => setBrand(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">All</option>
                    <option value="Uniqlo">Uniqlo</option>
                    <option value="Zara">Zara</option>
                </select>
            </div>

            <div>
                <h3 className="font-bold mb-2">Gender</h3>
                <select onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNISEX">Unisex</option>
                </select>
            </div>

            <div>
                <h3 className="font-bold mb-2">Material</h3>
                <select onChange={(e) => setMaterial(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">All</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Denim">Denim</option>
                    <option value="Leather">Leather</option>
                </select>
            </div>

            <button
                onClick={applyFilters}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
                Apply Filters
            </button>
        </aside>
    );
}
