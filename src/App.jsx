import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import About from './Components/About';
import Guide from './Components/Guide';
import SignIn from './Components/SignIn';
import Home from './Components/Home';
import SignUp from './Components/Signup';
import CommandManager from './Components/CommandManager';
import ProfilePage from './Components/ProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }

    // listen for login event from SignIn
    const handleLoginEvent = () => setIsLoggedIn(true);
    window.addEventListener("userLoggedIn", handleLoginEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/signin"; 
  };

  return (
    <Router>
      <div className="jarvis-wrapper">
        <header className="jarvis-header">
          <h1>JARVIS Assistant</h1>
          <nav className="header-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/guide">Guide</Link>
            <Link to="/commandManager">SetPath</Link>

            {!isLoggedIn ? (
              <>
                <Link to="/signin">SignIn</Link>
                <Link to="/signup">SignUp</Link>
              </>
            ) : (
              <>
                <Link to="/profile">Profile</Link>
                <button id="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/commandManager" element={<CommandManager />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
