import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import "../styles/login.css";
import { useAuth } from "../Components/AuthProvider";
import SubmitButton from "../Components/submitButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation(); // Initialize useLocation
  const auth = useAuth();

  useEffect(() => {
    console.log(isLoading, "Loading state changed");
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (email && password) {
      try {
        await auth.loginAction({ email, password }); // Await the login action
      } catch (error) {
        console.error(error);
        alert("Login failed: " + error.message);
      } finally {
        setIsLoading(false); // Set loading to false after login attempt
      }
    } else {
      setIsLoading(false);
      alert("Please provide a valid input");
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to sHule ....</h1>
      <form onSubmit={handleSubmit} className="LoginForm">
        <h3>Let's Login</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <SubmitButton text="Login" isLoading={isLoading} />
      </form>
    </div>
  );
}

export default Login;
