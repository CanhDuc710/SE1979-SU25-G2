import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-10 p-6">
            <div className="container mx-auto grid grid-cols-4 gap-6 text-sm">
                {/* Các cột hiện tại */}
                <div>
                    <h4 className="font-bold mb-2">WE</h4>
                    <input type="email" placeholder="Enter email…" className="p-1 text-black w-full mb-2"/>
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

            {/* Google Map */}
            <div className="mt-6">
                <h4 className="font-bold mb-2 text-sm">OUR STORE</h4>
                <div className="w-full h-[200px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57875.83929300421!2d105.7707201486328!3d21.03610310000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab499b338177%3A0xa296f2a8feea1816!2zSMOgbmcgSGnhu4d1IEF1dGhlbnRpYw!5e1!3m2!1svi!2s!4v1748933518137!5m2!1svi!2s"
                        width="100%" height="100%"
                        style={{border: 0}}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

        </footer>
    );
}
