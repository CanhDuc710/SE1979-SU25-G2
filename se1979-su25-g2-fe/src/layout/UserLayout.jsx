import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
