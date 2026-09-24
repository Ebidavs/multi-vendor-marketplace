import "./register.css";

function Register(){
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join our marketplace today</p>

                <form>
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name"></input>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email"></input>
                    <label>Password</label>
                    <input type="password" placeholder="Create a password"></input>
                    <label>Confirm password</label>
                    <input type="password" placeholder="Confirm your password"></input>

                    <button type="submit">Register</button>
                </form>

                <p className="auth-footer">Already have an account? < a href="/login">Login</a></p>
            </div>
        </div>
    );
}
export default Register