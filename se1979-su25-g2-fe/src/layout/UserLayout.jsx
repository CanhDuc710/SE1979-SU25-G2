import React, { useState } from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
    const [searchKeyword, setSearchKeyword] = useState("");

    return (
        <>
            <Header onSearch={setSearchKeyword} />
            <main className="min-h-screen">
                <Outlet context={{ searchKeyword }} />
            </main>
            <Footer />
        </>
    );
}
