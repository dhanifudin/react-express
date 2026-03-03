import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import apiClient from '../axiosClient';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const expired = location.state?.expired;
  const registered = location.state?.registered;
  const passwordReset = location.state?.passwordReset;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/users/login', form);
      dispatch(login({ token: data.token, user: { _id: data._id, name: data.name, email: data.email } }));
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        {expired && <p className="auth-notice">Your session expired. Please sign in again.</p>}
        {registered && <p className="auth-notice">Account created! You can now sign in.</p>}
        {passwordReset && <p className="auth-notice">Password reset! You can now sign in with your new password.</p>}
        {error && <p className="auth-error">{error}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="••••••••"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer"><Link to="/forgot-password">Forgot password?</Link></p>
        <p className="auth-footer">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
