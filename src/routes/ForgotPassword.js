import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../axiosClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/users/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        {submitted ? (
          <>
            <p className="auth-notice">
              If that email is registered, a reset link has been sent. Check your inbox.
            </p>
            <p className="auth-footer"><Link to="/login">Back to Sign In</Link></p>
          </>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <p style={{ marginBottom: '16px', color: '#555' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form className="form" onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
            <p className="auth-footer"><Link to="/login">Back to Sign In</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
