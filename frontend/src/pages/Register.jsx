import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Directly hitting your base API config

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Payload keys match your Java 'User' entity field variables exactly: fullName, email, password
    const payload = { fullName, email, password };

    try {
      await apiClient.post('/auth/register', payload);
      setSuccess('Account registered successfully! Redirecting to login...');
      
      // Clear inputs
      setFullName('');
      setEmail('');
      setPassword('');

      // Auto redirect to sign-in page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '340px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '20px' }}>Create Account</h2>
        
        {error && <p style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>{error}</p>}
        {success && <p style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>{success}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
          <input type="text" placeholder="Your full name" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
          <input type="email" placeholder="e.g. hari@gmail.com" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
          <input type="password" placeholder="Create secure password" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button type="submit" style={{ width: '100%', backgroundColor: '#1e3a8a', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
          Register Account
        </button>

        <p style={{ textAlign: 'center', margin: 0, fontSize: '14px' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#1e3a8a', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;