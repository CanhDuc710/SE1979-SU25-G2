import { useEffect, useState } from 'react';
import { fetchAllBrands, fetchAllMaterials } from '../service/productService';

export default function SidebarFilter({ onFilterChange }) {
    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [brand, setBrand] = useState('');
    const [gender, setGender] = useState('');
    const [material, setMaterial] = useState('');

    useEffect(() => {
        fetchAllBrands()
            .then(setBrands)
            .catch(err => console.error("❌ Failed to load brands", err));

        fetchAllMaterials()
            .then(setMaterials)
            .catch(err => console.error("❌ Failed to load materials", err));
    }, []);

    const applyFilters = () => {
        onFilterChange({ brand, gender, material });
    };

    return (
        <aside className="w-64 pr-4 border-r space-y-4">
            {/* BRAND */}
            <div>
                <h3 className="font-bold mb-2">Thương hiệu</h3>
                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="">All</option>
                    {brands.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                </select>
            </div>

            {/* GENDER */}
            <div>
                <h3 className="font-bold mb-2">Giới tính</h3>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNISEX">Unisex</option>
                </select>
            </div>

            {/* MATERIAL */}
            <div>
                <h3 className="font-bold mb-2">Chất liệu</h3>
                <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="">All</option>
                    {materials.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>

            {/* APPLY BUTTON */}
            <button
                onClick={applyFilters}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
                Tìm kiếm
            </button>
        </aside>
    );
}
