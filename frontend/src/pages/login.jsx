import "./login.css";

function Login(){
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p>Login to your marketplace account</p>

                <form>
                <label>Email</label>
                <input type="email" placeholder="Enter your email"></input>
                <label>Password</label>
                <input type="password" placeholder="Enter your password"></input>
                <button type="submit">Login</button>

                     </form>
                <p className="auth-footer">Don't have an account? <a href="/register">Register</a>  </p>

            </div>

        </div>
    )
}
export default Login;