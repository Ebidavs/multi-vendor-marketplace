import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import { loginUser, setToken } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.from;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser({
                email,
                password,
            });

            if (!data.token || !data.user) {
                throw new Error("The login response did not include a user session.");
            }
            if (returnTo === "/checkout" && data.user.role !== "customer") {
                throw new Error("Only customer accounts can continue to checkout.");
            }
            setToken(data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate(returnTo || "/", { replace: true });
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-brand">
                    <h1>Xi Market</h1>
                </div>

                <h2>Welcome Back</h2>

                <p className="login-subtitle">
                    Sign in to your Xi Market account
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="login-field">
                        <label htmlFor="email">Email Address</label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="forgot-link">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
