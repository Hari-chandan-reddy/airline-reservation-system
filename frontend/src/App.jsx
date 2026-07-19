import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';

function App() {
  // Global Session State: Tracks the logged-in user profile object
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userProfile) => {
    // Save snapshot into browser localStorage for session persistence across page reloads
    localStorage.setItem('loggedUser', JSON.stringify(userProfile));
    // Set React state to trigger UI updates across components that depend on user session
    setUser(userProfile);
  };

  const handleLogout = () => {
    // Wipe the user session from localStorage to ensure no residual data remains
    localStorage.removeItem('loggedUser');
    // Clear React state to trigger UI updates and redirect to login
    setUser(null);
  };

  return (
    <Router>
      {/* The Navbar component receives the user state to update its UI links */}
      <Navbar user={user} onLogout={handleLogout} />
      
      <Routes>
        {/* Registration View Access Gate */}
        <Route path="/" element={!user ? <Register /> : <Navigate to="/flights" />} />

        {/* Conditional Routing: If not logged in, show Login. If logged in, redirect to flights engine */}
        <Route path="/login" element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/flights" />} />
        
        {/* Protected Routing paths */}
        <Route path="/flights" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        <Route path="/bookings" element={user ? <Bookings user={user} /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;