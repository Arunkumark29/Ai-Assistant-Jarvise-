import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import JarvisPopup from './JarvisPopup'; // ✅ import Jarvis popup

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [showJarvis, setShowJarvis] = useState(false);
  const [jarvisMsg, setJarvisMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Show Jarvis popup instead of alert
        setJarvisMsg('Account created successfully!');
        setShowJarvis(true);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error connecting to server');
    }
  };

  const handleJarvisClose = () => {
    setShowJarvis(false);
    navigate('/signIn'); // ✅ Redirect after closing Jarvis popup
  };

  return (
    <div className="signin-container">
      <div className="bg-effects"></div>

      <div className="signin-card">
        <h2 className="signin-title">Create Your Account</h2>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-button">
            Create Account
          </button>
        </form>

        <p className="signin-footer">
          Already have an account? <Link to="/signIn">Sign In</Link>
        </p>
      </div>

      {/* ✅ Show Jarvis popup when account is created */}
      {showJarvis && (
        <JarvisPopup message={jarvisMsg} onClose={handleJarvisClose} />
      )}
    </div>
  );
};

export default SignUp;
