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
  const [user, setUser] = useState(null);

  const handleLogout = () => {
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
        <Route path="/login" element={!user ? <Login onLoginSuccess={setUser} /> : <Navigate to="/flights" />} />
        
        {/* Protected Routing paths */}
        <Route path="/flights" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;