import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  confirmAccountReactivation,
  requestAccountReactivation,
  verifyAccountReactivationOtp,
} from "../services/api";
import "./AccountReactivation.css";

function AccountReactivation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setOtp("");
    setCodeSent(false);
    setCodeVerified(false);
    setError("");
    setMessage("");
  };

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await requestAccountReactivation(email.trim());
      setCodeSent(true);
      setOtp("");
      setCodeVerified(false);
      setMessage(
        result.message || "If your account is eligible, a reactivation code has been sent."
      );
    } catch (requestError) {
      setError(requestError.message || "We couldn't send a reactivation code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await verifyAccountReactivationOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      setCodeVerified(true);
      setMessage(result.message || "Code verified. Reactivate your account to continue.");
    } catch (verificationError) {
      setCodeVerified(false);
      setError(
        verificationError.message ||
          "We couldn't verify that code. Check it and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await confirmAccountReactivation({
        email: email.trim(),
        otp: otp.trim(),
      });
      navigate("/login", {
        state: {
          message:
            result.message ||
            "Your account has been reactivated. Please log in to continue.",
        },
      });
    } catch (reactivationError) {
      setCodeVerified(false);
      setError(
        reactivationError.message ||
          "We couldn't reactivate your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reactivation-page">
      <section className="reactivation-card" aria-labelledby="reactivation-heading">
        <div className="reactivation-mark" aria-hidden="true">XM</div>
        <p className="reactivation-kicker">ACCOUNT SUPPORT</p>
        <h1 id="reactivation-heading">Reactivate your account</h1>
        <p className="reactivation-intro">
          Enter the email address linked to your Xi Market account. We’ll send a
          one-time code so you can safely restore access.
        </p>

        <form onSubmit={codeSent ? handleVerifyCode : handleRequestCode}>
          <div className="reactivation-field">
            <label htmlFor="reactivation-email">Email address</label>
            <input
              id="reactivation-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading || codeVerified}
            />
          </div>

          {codeSent && (
            <div className="reactivation-field">
              <label htmlFor="reactivation-otp">Six-digit code</label>
              <input
                id="reactivation-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter your code"
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setCodeVerified(false);
                  setError("");
                  setMessage("");
                }}
                pattern="[0-9]{6}"
                maxLength={6}
                required
                disabled={loading || codeVerified}
              />
              <span className="reactivation-hint">The code must contain 6 digits.</span>
            </div>
          )}

          {message && (
            <p className="reactivation-message reactivation-success" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="reactivation-message reactivation-error" role="alert">
              {error}
            </p>
          )}

          {!codeVerified ? (
            <button
              type="submit"
              className="reactivation-button"
              disabled={loading || (codeSent && otp.length !== 6)}
            >
              {loading
                ? codeSent
                  ? "Verifying code..."
                  : "Sending code..."
                : codeSent
                  ? "Verify Code"
                  : "Send Reactivation Code"}
            </button>
          ) : (
            <button
              type="button"
              className="reactivation-button"
              onClick={handleReactivate}
              disabled={loading}
            >
              {loading ? "Reactivating..." : "Reactivate Account"}
            </button>
          )}
        </form>

        {codeSent && !codeVerified && (
          <button
            type="button"
            className="reactivation-resend"
            onClick={handleRequestCode}
            disabled={loading}
          >
            Send a new code
          </button>
        )}

        <p className="reactivation-login">
          Remembered your password? <Link to="/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}

export default AccountReactivation;
