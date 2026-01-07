import React, { useState } from 'react';
import './SignIn.css'; 
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Dispatch custom event to notify App
        window.dispatchEvent(new Event("userLoggedIn"));

        // Redirect to home page
        navigate("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <div className="bg-effects"></div>

      <div className="signin-card">
        <h2 className="signin-title">Welcome Back, Commander</h2>

        <form className="signin-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signin-button">Sign In</button>
        </form>

        <p className="signin-footer">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
