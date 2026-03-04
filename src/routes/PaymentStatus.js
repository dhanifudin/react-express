import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentStatus } from '../store/paymentSlice';

export default function PaymentStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, status } = useSelector((state) => state.payment);
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const [orderId, setOrderId] = useState('');

  if (!isAuthenticated) {
    return (
      <div>
        <p><Link to="/login">Sign in</Link> to check payment status.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchPaymentStatus(orderId)).unwrap().catch((err) => {
      if (err?.expired) navigate('/login', { state: { expired: true } });
    });
  };

  return (
    <div>
      <p><Link to="/payment">← Back to Payment</Link></p>
      <h2 style={{ marginTop: '12px' }}>Check Payment Status</h2>

      {error && !error.expired && (
        <p style={{ color: 'red', margin: '12px 0' }}>
          Error: {typeof error === 'string' ? error : 'Something went wrong.'}
        </p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>Order ID</label>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="ORDER-..."
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Checking…' : 'Check Status'}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '24px' }}>
          <h3>Transaction Status</h3>
          <pre className="response-body" style={{ marginTop: '8px' }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
