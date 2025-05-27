import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
            <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
                Back to Home
            </Link>
        </div>
    );
}
