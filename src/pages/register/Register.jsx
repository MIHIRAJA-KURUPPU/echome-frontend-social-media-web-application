import "./register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password !== passwordAgain) {
            setError("Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        setLoading(true);

        try {
            await API.post("/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">EchoME</h3>
                    <span className="loginDesc">
                    Stay connected, share moments, and  <br/> discover the world around you.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleRegister}>
                        {error && <span className="loginError">{error}</span>}
                        <input 
                            placeholder="User Name" 
                            className="loginInput" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="4"
                        />
                        <input 
                            placeholder="Email" 
                            className="loginInput" 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            placeholder="Password" 
                            className="loginInput" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <input 
                            placeholder="Password Again" 
                            className="loginInput" 
                            type="password"
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            required
                        />
                        <button className="loginButton" type="submit" disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                        <button 
                            className="loginRegisterButton" 
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Log into Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
