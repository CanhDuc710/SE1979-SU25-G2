import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Header({ onSearch }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            onSearch(query);

            // Nếu đang không ở trang /products thì chuyển sang đó
            if (!location.pathname.startsWith("/products")) {
                navigate("/products");
            }
        }
    };

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="text-xl font-bold">WE</Link>
                <nav className="space-x-4 text-sm">
                    <a href="#">New In</a>
                    <a href="#">Women</a>
                    <a href="#">Men</a>
                    <a href="#">Bags</a>
                    <a href="#">Sale</a>
                    <a href="#">Collections</a>
                </nav>
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="border px-2 py-1 rounded"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Link to="/cart" className="relative">
                        <span className="text-2xl">🛒</span>
                    </Link>
                    <button>👤</button>
                </div>
            </div>
        </header>
    );
}
