import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as storeService from "../service/storeService";

export default function Header({ onSearch }) {
    const [store, setStore] = useState({ storeName: '', logo: '' });
    const [query, setQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra token khi mount component
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]); // để cập nhật khi chuyển trang

    useEffect(() => {
        (async () => {
            try {
                const data = await storeService.getStoreInformation();
                setStore({ storeName: data.storeName, logo: data.logo });
            } catch {
                // fallback
            }
        })();
    }, []);

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
                {/* Logo + Tên shop */}
                <Link to="/" className="flex items-center gap-2 min-w-[120px]">
                    {store.logo
                        ? <img src={store.logo} alt="Logo" className="h-9 w-9 object-contain rounded-full bg-gray-200 p-1" />
                        : <span className="text-xl font-bold bg-gray-200 text-gray-800 rounded-full w-9 h-9 flex items-center justify-center">WE</span>
                    }
                    <span className="text-xl font-bold text-gray-900">{store.storeName || "WE"}</span>
                </Link>
                <nav className="space-x-4 text-sm text-indigo-600">
                    <a href="#">New In</a>
                    <a href="#">Women</a>
                    <a href="#">Men</a>
                    <a href="#">Bags</a>
                    <a href="#">Sale</a>
                    <a href="#">Collections</a>
                </nav>
                {/* Search + Cart + User */}
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
