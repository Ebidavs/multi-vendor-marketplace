import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import { loginUser, setToken } from "../services/api";
import shoppingIllustration from "../assets/web-shopping.svg";
import xiMarketLogo from "../assets/xi-market-logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser({
                email,
                password,
            });

            localStorage.setItem("user", JSON.stringify(data));

            // Persist the JWT under the key that services/api.js reads, so
            // authenticated requests (cart, orders, checkout) send it.
            if (data?.data?.token) {
                setToken(data.data.token);
            }

            navigate("/products");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <main className="login-layout">
                <section className="login-showcase" aria-label="Xi Market">
                    <div className="showcase-orb showcase-orb-top" aria-hidden="true" />
                    <div className="showcase-orb showcase-orb-bottom" aria-hidden="true" />
                    <div className="showcase-content">
                        <p className="showcase-eyebrow">YOUR EVERYDAY MARKETPLACE</p>
                        <h1>Good finds.<br />Great living.</h1>
                        <p className="showcase-copy">
                            Everything you need, all in one market.
                        </p>
                        <div className="showcase-art">
                            <img src={shoppingIllustration} alt="" />
                        </div>
                        <p className="showcase-footnote">
                            Discover more from the sellers you love.
                        </p>
                    </div>
                </section>

                <section className="login-form-panel" aria-labelledby="login-heading">
                    <div className="login-card">
                        <div className="login-brand">
                            <span className="login-brand-crop">
                                <img src={xiMarketLogo} alt="Xi Market" />
                            </span>
                        </div>

                        <div className="login-intro">
                            <p className="login-kicker">WELCOME TO XI MARKET</p>
                            <h2 id="login-heading">Welcome Back <span aria-hidden="true">👋</span></h2>
                            <p className="login-subtitle">
                                Sign in to continue shopping.
                            </p>
                        </div>

                        {location.state?.message && (
                            <p className="login-success" role="status">
                                {location.state.message}
                            </p>
                        )}

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
                        <p className="reactivation-link">
                            Account deactivated?{" "}
                            <Link to="/reactivate-account">Reactivate it</Link>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Login;
