import React, { useState } from 'react';
import { loginUser } from '../api/apiServices';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Kept local for form completion
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    // Prevent Form Reload: Stops the browser from refreshing and erasing React state
    e.preventDefault();
    
    try {
      // Network Validation: Check if this email exists in our MySQL database
      const userProfile = await loginUser(email, password);
      console.log("User authenticated successfully:", userProfile); // Debugging line to confirm successful login
      
      // Session Uplift: Pass the verified user object back up to App.jsx
      onLoginSuccess(userProfile);
    } catch (err) {
      setError("Authentication failed. Email or password is incorrect.");
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '80vh', fontFamily: 'sans-serif' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '20px' }}>
          Sign In
        </h2>
        
        {error && <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>{error}</p>}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="e.g. hari@gmail.com"
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Password
          </label>
          <input 
            type="password" 
            placeholder="Enter your password"
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        
        <button type="submit" style={{ 
          width: '100%', backgroundColor: '#1e3a8a', color: 'white', 
          padding: '12px', border: 'none', borderRadius: '4px',
          fontWeight: 'bold', cursor: 'pointer' 
        }}>
          Authenticate
        </button>
      </form>
    </div>
  );
}

export default Login;