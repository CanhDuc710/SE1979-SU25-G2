import React, { useEffect, useState } from "react";
import { getAllFaqs, createFaq, deleteFaq } from "../../service/faqService";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");

    const loadFaqs = async () => {
        setLoading(true);
        try {
            setFaqs(await getAllFaqs());
        } catch {
            setError("Không thể tải FAQ.");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFaqs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) {
            setError("Vui lòng nhập đủ thông tin.");
            return;
        }
        try {
            await createFaq({ question, answer });
            setQuestion("");
            setAnswer("");
            setError("");
            loadFaqs();
        } catch {
            setError("Không thể thêm FAQ.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa FAQ này?")) {
            try {
                await deleteFaq(id);
                loadFaqs();
            } catch {
                setError("Không thể xóa FAQ.");
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
                <input
                    className="border rounded w-full p-2 mb-2"
                    placeholder="Câu hỏi"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    required
                />
                <textarea
                    className="border rounded w-full p-2 mb-2"
                    placeholder="Trả lời"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    required
                />
                <button className="bg-black text-white px-4 py-2 rounded" type="submit">
                    Thêm
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <ul className="space-y-4">
                    {faqs.map(faq => (
                        <li key={faq.id} className="border rounded p-4 bg-white shadow">
                            <div className="font-semibold">{faq.question}</div>
                            <div className="text-gray-700 mt-2">{faq.answer}</div>
                            <button
                                className="mt-2 text-red-500 text-sm"
                                onClick={() => handleDelete(faq.id)}
                            >
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}