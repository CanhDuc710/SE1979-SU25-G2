import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF } from "react-icons/fa";
import * as storeService from "../service/storeService.js";

export default function Footer() {
    const [store, setStore] = useState({
        storeName: '',
        email: '',
        fanpage: '',
        phone: '',
        address: '',
        logo: '',
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await storeService.getStoreInformation();
                setStore(data);
            } catch {
                // fallback nếu fetch lỗi
            }
        })();
    }, []);

    return (
        <footer className="bg-gray-800 text-white mt-10 pt-8 pb-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                {/* Cột Store Information */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        {store.logo
                            ? <img src={store.logo} alt="Logo" className="h-12 w-12 object-contain rounded-full bg-white p-1" />
                            : <span className="font-bold text-2xl bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center">WE</span>
                        }
                        <div className="font-bold text-lg">{store.storeName}</div>
                    </div>
                    <ul className="space-y-1">
                        {store.address &&
                            <li className="flex items-start gap-2">
                                <FaMapMarkerAlt className="mt-1 text-blue-400" />
                                <span>{store.address}</span>
                            </li>
                        }
                        {store.phone &&
                            <li className="flex items-start gap-2">
                                <FaPhoneAlt className="mt-1 text-green-400" />
                                <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
                            </li>
                        }
                        {store.email &&
                            <li className="flex items-start gap-2">
                                <FaEnvelope className="mt-1 text-yellow-400" />
                                <a href={`mailto:${store.email}`} className="hover:underline">{store.email}</a>
                            </li>
                        }
                        {store.fanpage &&
                            <li className="flex items-start gap-2">
                                <FaFacebookF className="mt-1 text-blue-500" />
                                <a href={store.fanpage} target="_blank" rel="noopener noreferrer"
                                   className="hover:underline text-blue-400">Fanpage</a>
                            </li>
                        }
                    </ul>
                </div>
                {/* Các cột còn lại giữ nguyên */}
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
            <div className="container mx-auto mt-6 text-xs text-center text-gray-400">
                &copy; {new Date().getFullYear()} {store.storeName || 'WE'} — All rights reserved.
            </div>
        </footer>
    );
}
