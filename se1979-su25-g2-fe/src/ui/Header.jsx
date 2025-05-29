import React from 'react';

export default function Header() {
    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">WE</h1>
                <nav className="space-x-4 text-sm">
                    <a href="#">New In</a>
                    <a href="#">Women</a>
                    <a href="#">Men</a>
                    <a href="#">Bags</a>
                    <a href="#">Sale</a>
                    <a href="#">Collections</a>
                </nav>
                <div className="flex items-center space-x-3">
                    <input type="text" placeholder="Search…" className="border px-2 py-1 rounded" />
                    <button>🛒</button>
                    <button>👤</button>
                </div>
            </div>
        </header>
    );
}
