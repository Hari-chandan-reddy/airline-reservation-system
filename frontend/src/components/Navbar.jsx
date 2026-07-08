import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 40px', 
      backgroundColor: '#1e3a8a', // Deep Blue Header Banner
      color: 'white', 
      fontFamily: 'sans-serif'
    }}>
      {/* Brand Logo - Clicking it redirects the browser home */}
      <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
        Hari Airlines
      </h2>
      
      {/* Conditional Link Container: Only displays if a user session is active */}
      {user && (
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link to="/flights" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Search Flights
          </Link>
          <Link to="/bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            My Bookings
          </Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Welcome, {user.fullName}
          </Link>
          <button onClick={onLogout} style={{
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            padding: '8px 14px', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;