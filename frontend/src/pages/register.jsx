import "./register.css";

function Register(){
    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-brand">

                <h1>Marketplace</h1>
                </div>
                <h2>Create Account</h2>
                <p className="register-subtitle">Create your marketplace account</p>

                <form>
                    <div className="register-field">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" required></input>
                    </div>

                    <div className="register-field">
                    <label>Email</label>

                    <input type="email" placeholder="Enter your email" required></input>
                    </div>

                    <div className="register-field">
                    <label>Password</label>
                    <input type="password" placeholder="Create a password" required></input>

                    </div>

                    <div className="register-field">

                    <label>Confirm password</label>
                    <input type="password" placeholder="Confirm your password" required></input>

                        </div>

                    <button type="submit" className="register-button">Create Account</button>
                </form>

                <p className="login-text">Already have an account?{" "} < a href="/login">Login</a></p>
            </div>
        </div>
    );
}
export default Register