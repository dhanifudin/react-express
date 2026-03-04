import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSnapToken, clearPayment } from "../store/paymentSlice";

const RESULT_LABELS = {
  success: "Payment successful!",
  pending: "Payment pending.",
  error: "Payment failed.",
  closed: "Payment popup closed.",
};

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.payment);
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const [grossAmount, setGrossAmount] = useState("");
  const [itemName, setItemName] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);

  if (!isAuthenticated) {
    return (
      <p>
        <Link to="/login">Sign in</Link> to make a payment.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearPayment());
    setPaymentResult(null);

    let result;
    try {
      result = await dispatch(
        createSnapToken({
          order_id: `ORDER-${Date.now()}`,
          gross_amount: Number(grossAmount),
          item_details: [{ id: "1", price: Number(grossAmount), quantity: 1, name: itemName }],
        }),
      ).unwrap();
    } catch (err) {
      if (err?.expired) navigate("/login", { state: { expired: true } });
      return;
    }

    if (!window.snap) {
      setPaymentResult({
        type: "error",
        data: {
          status_message:
            "Midtrans Snap.js not loaded. Check REACT_APP_MIDTRANS_CLIENT_KEY in .env.",
        },
      });
      return;
    }

    window.snap.pay(result.token, {
      onSuccess(res) {
        setPaymentResult({ type: "success", data: res });
      },
      onPending(res) {
        setPaymentResult({ type: "pending", data: res });
      },
      onError(res) {
        setPaymentResult({ type: "error", data: res });
      },
      onClose() {
        setPaymentResult((prev) => prev || { type: "closed", data: null });
      },
    });
  };

  return (
    <div>
      <h2>Make a Payment</h2>

      {error && !error.expired && (
        <p style={{ color: "red", marginBottom: "16px" }}>
          {typeof error === "string" ? error : "Something went wrong."}
        </p>
      )}

      {paymentResult && (
        <div
          className={`payment-result payment-result--${paymentResult.type}`}
          style={{ marginBottom: "20px" }}
        >
          <strong>{RESULT_LABELS[paymentResult.type]}</strong>
          {paymentResult.data && (
            <pre className="response-body" style={{ marginTop: "8px" }}>
              {JSON.stringify(paymentResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="e.g. Premium Plan"
          required
        />
        <label>Amount (IDR)</label>
        <input
          type="number"
          min="1"
          value={grossAmount}
          onChange={(e) => setGrossAmount(e.target.value)}
          placeholder="e.g. 50000"
          required
        />
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating token…" : "Pay with Midtrans"}
          </button>
          <Link to="/payment/status">Check Payment Status</Link>
        </div>
      </form>
    </div>
  );
}
