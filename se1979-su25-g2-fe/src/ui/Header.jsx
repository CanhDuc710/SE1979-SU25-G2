import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Header({ onSearch }) {
    const [query, setQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra token khi mount component
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]); // để cập nhật khi chuyển trang

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            onSearch(query);

            if (!location.pathname.startsWith("/products")) {
                navigate("/products");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="text-xl font-bold text-indigo-600">WE</Link>

                <nav className="space-x-4 text-sm text-indigo-600">
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

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white text-sm"
                        >
                            Đăng xuất
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white text-sm"
                        >
                            👤
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
