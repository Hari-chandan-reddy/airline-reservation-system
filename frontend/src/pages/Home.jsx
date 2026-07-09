import React, { useState, useEffect } from 'react';
import { getAllFlights, searchFlights } from '../api/apiServices';

function Home({ user }) {
  // Form Search Fields State
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  // Data Storage States
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hook: Fetch ALL available flights automatically when dashboard mounts
  useEffect(() => {
    loadAllFlights();
  }, []);

  const loadAllFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllFlights();
      setFlights(data);
    } catch (err) {
      setError('Could not establish data network sync. Check backend server statuses.');
    } finally {
      setLoading(false);
    }
  };

  // Form Parameter Filter Handler
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const filteredData = await searchFlights(source, destination);
      setFlights(filteredData);
      if (filteredData.length === 0) {
        setError('No active schedules found matching this search configuration.');
      }
    } catch (err) {
      setError('Query execution failed.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Grid View Action
  const handleClearSearch = () => {
    setSource('');
    setDestination('');
    loadAllFlights(); // Reload everything out of MySQL
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2>Welcome back, {user?.fullName || 'Passenger'}!</h2>
        <p style={{ color: '#666', margin: 0 }}>Explore current listings or input custom route trajectories to book tickets.</p>
      </div>
      
      {/* Search Input Control Console */}
      <form onSubmit={handleSearch} style={{
        display: 'flex', gap: '20px', backgroundColor: '#f8fafc', 
        padding: '25px', borderRadius: '8px', alignItems: 'flex-end',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)', 
        marginBottom: '35px', border: '1px solid #e2e8f0'
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>From (Source)</label>
          <input type="text" placeholder="e.g. Hyderabad" required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={source} onChange={e => setSource(e.target.value)} />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>To (Destination)</label>
          <input type="text" placeholder="e.g. Mumbai" required style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} value={destination} onChange={e => setDestination(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{
            backgroundColor: '#1e3a8a', color: 'white', border: 'none', 
            padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', 
            cursor: 'pointer', height: '40px'
          }}>
            {loading ? 'Processing...' : 'Search'}
          </button>
          
          {(source || destination) && (
            <button type="button" onClick={handleClearSearch} style={{
              backgroundColor: '#64748b', color: 'white', border: 'none', 
              padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', 
              cursor: 'pointer', height: '40px'
            }}>
              Clear Filters
            </button>
          )}
        </div>
      </form>

      {/* Dynamic Status Notifications */}
      {loading && <p style={{ textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold' }}>Syncing data grids from airline services...</p>}
      {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{error}</p>}

      {/* Main Flights Data Output Interface */}
      {!loading && flights.length > 0 && (
        <div>
          <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>Flight Deployments</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '14px' }}>Flight No</th>
                <th style={{ padding: '14px' }}>Airline</th>
                <th style={{ padding: '14px' }}>Route</th>
                <th style={{ padding: '14px' }}>Departure Time</th>
                <th style={{ padding: '14px' }}>Arrival Time</th>
                <th style={{ padding: '14px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flightId} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: '#0f172a' }}>{flight.flightNumber}</td>
                  <td style={{ padding: '14px', color: '#334155' }}>{flight.airlineName}</td>
                  <td style={{ padding: '14px', color: '#334155', fontWeight: '500' }}>
                    {flight.source} ➔ {flight.destination}
                  </td>
                  <td style={{ padding: '14px', fontSize: '14px', color: '#475569' }}>{flight.departureTime}</td>
                  <td style={{ padding: '14px', fontSize: '14px', color: '#475569' }}>{flight.arrivalTime}</td>
                  <td style={{ padding: '14px' }}>
                    <button style={{
                      backgroundColor: '#10b981', color: 'white', border: 'none',
                      padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold',
                      cursor: 'pointer'
                    }} onClick={() => alert(`Initiating manifest allocation configuration for Flight: ${flight.flightNumber}`)}>
                      Book Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;