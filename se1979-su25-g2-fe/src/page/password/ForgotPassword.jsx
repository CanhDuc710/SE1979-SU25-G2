import { useState } from 'react';
import { sendOtp } from '../../service/authService';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await sendOtp(email);
            alert('OTP đã được gửi tới email của bạn');
            navigate('/reset-otp', { state: { email } });
        } catch (err) {
            const msg =
                typeof err.response?.data === 'string'
                    ? err.response.data
                    : err.response?.data?.message || err.message || 'Gửi OTP thất bại';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Quên mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
            </form>
        </div>
    );
}
