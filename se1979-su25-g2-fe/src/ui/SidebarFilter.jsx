import React from 'react';

export default function SidebarFilter() {
    return (
        <aside className="w-64 pr-4 border-r">
            <h3 className="font-bold mb-2">Category</h3>
            <ul>
                <li><input type="checkbox" checked /> T-Shirts</li>
                <li><input type="checkbox" /> Shirts</li>
            </ul>
            {/* Các phần Brand, Price, Gender, Size tương tự */}
        </aside>
    );
}
