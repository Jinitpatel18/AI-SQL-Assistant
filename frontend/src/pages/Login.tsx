import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../api/authApi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginApi(email, password);
            navigate('/verify-login-otp', { state: { email } });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-text-primary">
                        AI SQL Assistant
                    </h1>
                    <p className="text-text-muted text-sm mt-1 font-mono">
                        log in to continue
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
                        <label className="block text-sm text-text-muted mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-bg-base border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-text-muted mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-bg-base border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-bg-base font-medium rounded py-2 hover:bg-accent-dim transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>

                    <p className="text-center text-sm text-text-muted">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-accent hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;