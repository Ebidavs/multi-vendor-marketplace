import "./login.css";

function Login (){
    return (
        <div className="login-page">
            <div className="login-card">

        <div className="login-brand">
            <h1>Marketplace</h1>
        </div>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your marketplace account</p>

        <form>
            <div className="login-field">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required></input>
            </div>
        <div className="login-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required></input>

        </div>
        <div className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>

        </div>
        
        <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-text">Don't have an account?{" "}
            <a href="/register">Register</a>
        </p>

            </div>
        </div>
    );
}
export default Login;