import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyLoginOtpApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function VerifyLoginOtp() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const email = location.state?.email || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await verifyLoginOtpApi(email, otp);
            login(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
                <div className="text-center">
                    <p className="text-text-muted">No email found. Please log in first.</p>
                    <Link to="/login" className="text-accent hover:underline">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-text-primary">
                        Two-step verification
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                        Enter the code sent to <span className="text-text-primary font-mono">{email}</span>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-bg-surface border border-border rounded-lg p-6 space-y-4"
                >
                    {error && (
                        <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-text-muted mb-1">
                            Verification code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                            className="w-full bg-bg-base border border-border rounded px-3 py-2 text-text-primary text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:border-accent"
                            placeholder="000000"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-bg-base font-medium rounded py-2 hover:bg-accent-dim transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify & continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyLoginOtp;