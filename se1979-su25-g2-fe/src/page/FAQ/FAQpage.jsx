import React, { useEffect, useState } from "react";
import axios from "axios";

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        axios.get("/api/faqs")
            .then(res => setFaqs(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="text-center mt-16 mb-8">
                <h1 className="text-5xl font-extrabold tracking-wide">FAQS</h1>
            </div>

            {/* Main content */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Left: FAQs */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-6">Frequently<br />asked questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={faq.id} className="border rounded-lg">
                                <button
                                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium focus:outline-none"
                                    onClick={() => handleToggle(idx)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="text-xl">{openIndex === idx ? "-" : "+"}</span>
                                </button>
                                {openIndex === idx && (
                                    <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: More questions box */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-gray-100 rounded-lg p-6 text-center shadow">
                        <div className="mb-4">
                            <div className="w-10 h-10 mx-auto bg-black rounded-full flex items-center justify-center text-white text-2xl">?</div>
                        </div>
                        <div className="font-semibold mb-2">Do you have more questions?</div>
                        <div className="text-gray-600 mb-4 text-sm">
                            Please contact our customer support for further help and information.
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition">
                            Email us now
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative elements (optional, SVG or absolute divs) */}
            {/* Bạn có thể thêm SVG hoặc hình vẽ tay ở đây nếu muốn */}

            {/* Footer placeholder */}
            <div className="mt-24"></div>
        </div>
    );
};

export default FAQPage;