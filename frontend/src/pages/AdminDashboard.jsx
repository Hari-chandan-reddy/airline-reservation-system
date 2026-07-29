import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    flightNumber: '',
    airlineName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 0
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      // Using admin endpoint to see all flights
      const res = await axios.get('http://localhost:8080/api/flights/admin/all');
      setFlights(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load flights. Make sure backend is running.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic Validation
    if (
      !formData.flightNumber ||
      !formData.airlineName ||
      !formData.source ||
      !formData.destination ||
      !formData.departureTime ||
      !formData.arrivalTime
    ) {
      setError('Please fill in all flight details.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/flights', formData);
      setFlights([...flights, response.data]);
      setSuccessMsg(`Flight ${response.data.flightNumber} added successfully! Seats generated.`);
      
      // Reset form
      setFormData({
        flightNumber: '',
        airlineName: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        totalSeats: 0
      });
    } catch (err) {
      setError('Failed to create flight. Please check inputs.');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/flights/${flightId}`);
      setFlights(flights.filter((f) => (f.flightId || f.id) !== flightId));
      setSuccessMsg('Flight removed successfully.');
    } catch (err) {
      setError('Failed to delete flight.');
    }
  };

  if (loading) return <div style={styles.centerText}>Loading Admin Dashboard...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage flight schedules and system records</p>
      </header>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {successMsg && <div style={styles.successAlert}>{successMsg}</div>}

      {/* --- ADD FLIGHT FORM --- */}
      <section style={styles.card}>
        <h2 style={styles.cardHeader}>Add New Flight Schedule</h2>
        <form onSubmit={handleAddFlight} style={styles.formGrid}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Flight Number</label>
            <input
              type="text"
              name="flightNumber"
              placeholder="e.g. 6E292"
              value={formData.flightNumber}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Airline Name</label>
            <input
              type="text"
              name="airlineName"
              placeholder="e.g. IndiGo"
              value={formData.airlineName}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Source</label>
            <input
              type="text"
              name="source"
              placeholder="e.g. Hyderabad"
              value={formData.source}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="e.g. Bengaluru"
              value={formData.destination}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Arrival Time</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleInputChange}
              min="1"
              max="300"
              style={styles.input}
            />
          </div>

          <div style={styles.buttonWrapper}>
            <button type="submit" style={styles.submitBtn}>
              + Deploy Flight
            </button>
          </div>
        </form>
      </section>

      {/* --- FLIGHT LIST TABLE --- */}
      <section style={styles.card}>
        <h2 style={styles.cardHeader}>Active Flight Deployments</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Flight No</th>
                <th style={styles.th}>Airline</th>
                <th style={styles.th}>Route</th>
                <th style={styles.th}>Departure</th>
                <th style={styles.th}>Arrival</th>
                <th style={styles.th}>Seats</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.length > 0 ? (
                flights.map((f) => {
                  const id = f.flightId || f.id;
                  return (
                    <tr key={id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{f.flightNumber}</strong></td>
                      <td style={styles.td}>{f.airlineName}</td>
                      <td style={styles.td}>{f.source} ➔ {f.destination}</td>
                      <td style={styles.td}>{new Date(f.departureTime).toLocaleString()}</td>
                      <td style={styles.td}>{new Date(f.arrivalTime).toLocaleString()}</td>
                      <td style={styles.td}>{f.totalSeats}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDeleteFlight(id)}
                          style={styles.deleteBtn}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={styles.emptyTd}>No flights registered in system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1e293b'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '28px',
    margin: '0 0 5px 0'
  },
  subtitle: {
    color: '#64748b',
    margin: 0
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    fontSize: '18px',
    marginTop: 0,
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569'
  },
  input: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #cbd5e1',
    fontSize: '14px'
  },
  buttonWrapper: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px'
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '5px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  tableHeaderRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '12px',
    fontSize: '13px',
    color: '#475569'
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '12px',
    fontSize: '14px'
  },
  emptyTd: {
    padding: '20px',
    textAlign: 'center',
    color: '#94a3b8'
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  successAlert: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  centerText: {
    textAlign: 'center',
    padding: '40px'
  }
};

export default AdminDashboard;