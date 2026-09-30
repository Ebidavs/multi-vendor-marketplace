import "./forgot-password.css";

function ForgotPassword() {
    return (
        <div className="forgot-page">
            <div className="forgot-card">
            <h1 >Forgot Password?</h1>

            <p>Enter your email address and we'll send you a link to reset your password</p>

            <form>

                <label>Email Address</label>
                
                <input type="email" placeholder="Enter your email" required></input>
                <button type="submit">Send Reset Link</button>

                <a href="/login">Back to Login</a>
            </form>
        </div>
        </div>
    );
}
export default ForgotPassword;