import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-10 p-6">
            <div className="container mx-auto grid grid-cols-4 gap-6 text-sm">
                <div>
                    <h4 className="font-bold mb-2">WE</h4>
                    <input type="email" placeholder="Enter email…" className="p-1 text-black w-full mb-2" />
                    <p className="text-xs">Your Privacy Policy warning text here.</p>
                </div>
                <div>
                    <h4 className="font-bold mb-2">SERVICE</h4>
                    <ul className="space-y-1">
                        <li>Contact</li>
                        <li>Shipping</li>
                        <li>Returns</li>
                        <li>Help Center</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">COMPANY</h4>
                    <ul className="space-y-1">
                        <li>About</li>
                        <li>Career</li>
                        <li>Press</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2">TERMS</h4>
                    <ul className="space-y-1">
                        <li>Privacy</li>
                        <li>Cookie Policy</li>
                        <li>Terms</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
