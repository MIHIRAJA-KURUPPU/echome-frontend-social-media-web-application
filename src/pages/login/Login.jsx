import "./login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", { email, password });
            
            if (response.data.success) {
                login(response.data.user, response.data.token);
                navigate("/");
            } else {
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
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
                    <form className="loginBox" onSubmit={handleLogin}>
                        {error && <span className="loginError">{error}</span>}
                        <input 
                            placeholder="Enter Your Email" 
                            className="loginInput" 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            placeholder="Enter Your Password" 
                            className="loginInput" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="loginButton" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button 
                            className="loginRegisterButton" 
                            type="button"
                            onClick={() => navigate("/register")}
                        >
                            Create a New Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
