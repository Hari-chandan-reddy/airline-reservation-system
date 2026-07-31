import React, { useState, useEffect } from 'react';
import {
  getAdminFlights,
  getAdminBookings,
  getBookingPassengers,
  getAdminUsers, // Ensure you import your fetch users function from apiServices
  createFlight,
  deleteFlight,
  updateFlightStatus
} from '../api/apiServices';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('flights'); // 'flights', 'bookings', or 'users'
  
  // Cleaned Users State (Starts empty, populated strictly from DB)
  const [users, setUsers] = useState([]);

  // Flights State
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [selectedBookingPassengers, setSelectedBookingPassengers] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Flight Form State
  const [formData, setFormData] = useState({
    flightNumber: '',
    airlineName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 0
  });

  const [editingFlight, setEditingFlight] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('Active');
  const [updateDeparture, setUpdateDeparture] = useState('');
  const [updateArrival, setUpdateArrival] = useState('');

  useEffect(() => {
    fetchFlights();
    fetchBookings();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load user records from database:', err);
    }
  };

  const fetchFlights = async () => {
    try {
      const data = await getAdminFlights();
      setFlights(data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load flights. Make sure backend is running.');
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getAdminBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load admin bookings.');
    }
  };

  const fetchPassengers = async (bookingId) => {
    try {
      setSelectedBookingId(bookingId);
      const data = await getBookingPassengers(bookingId);
      setSelectedBookingPassengers(data || []);
    } catch (err) {
      alert('Could not fetch passenger manifest.');
    }
  };

  // Helper function to convert backend dates for datetime-local input
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

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
      const newFlight = await createFlight(formData);
      setFlights([...flights, newFlight]);
      setSuccessMsg(`Flight ${newFlight.flightNumber} added successfully! Seats generated.`);
      
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
      await deleteFlight(flightId);
      setFlights(flights.filter((f) => (f.flightId || f.id) !== flightId));
      setSuccessMsg('Flight removed successfully.');
    } catch (err) {
      setError('Failed to delete flight.');
    }
  };

  const handleStatusUpdate = async (flightId) => {
    try {
      const updatedFlight = await updateFlightStatus(flightId, {
        status: updateStatus,
        departureTime: updateDeparture,
        arrivalTime: updateArrival
      });

      setFlights(flights.map(f => (f.flightId || f.id) === flightId ? updatedFlight : f));
      setSuccessMsg(`Flight #${flightId} updated successfully!`);
      setEditingFlight(null);
    } catch (err) {
      setError('Failed to update flight details.');
    }
  };

  if (loading) return <div style={styles.centerText}>Loading Admin Dashboard...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Control Center</h1>
        <p style={styles.subtitle}>System oversight for flights, bookings, and users</p>
      </header>

      {/* --- TAB NAVIGATION --- */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === 'flights' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('flights')}
        >
          ✈️ Flight Management
        </button>
        <button
          style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('bookings')}
        >
          📋 Booking Manifests ({bookings.length})
        </button>
        <button
          style={activeTab === 'users' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('users')}
        >
          👥 User Directory ({users.length})
        </button>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {successMsg && <div style={styles.successAlert}>{successMsg}</div>}

      {/* ================= FLIGHT MANAGEMENT TAB ================= */}
      {activeTab === 'flights' && (
        <>
          <section style={styles.card}>
            <h2 style={styles.cardHeader}>Add New Flight Schedule</h2>
            <form onSubmit={handleAddFlight} style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Flight Number</label>
                <input type="text" name="flightNumber" placeholder="e.g. 6E292" value={formData.flightNumber} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g. IndiGo" value={formData.airlineName} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Source</label>
                <input type="text" name="source" placeholder="e.g. Hyderabad" value={formData.source} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Destination</label>
                <input type="text" name="destination" placeholder="e.g. Bengaluru" value={formData.destination} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Departure Time</label>
                <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Arrival Time</label>
                <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Total Seats</label>
                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} min="1" max="300" style={styles.input} />
              </div>
              <div style={styles.buttonWrapper}>
                <button type="submit" style={styles.submitBtn}>+ Deploy Flight</button>
              </div>
            </form>
          </section>

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
                    <th style={styles.th}>Status</th>
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
                            <span style={styles.statusBadge}>{f.status || 'Active'}</span>
                          </td>
                          <td style={styles.td}>
                            {editingFlight === id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <select 
                                  value={updateStatus} 
                                  onChange={(e) => setUpdateStatus(e.target.value)}
                                  style={{ padding: '4px', borderRadius: '4px' }}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Delayed">Delayed</option>
                                  <option value="Cancelled">Cancelled</option>
                                  <option value="Boarding">Boarding</option>
                                </select>

                                <input 
                                  type="datetime-local" 
                                  value={updateDeparture} 
                                  onChange={(e) => setUpdateDeparture(e.target.value)}
                                  style={{ padding: '4px', fontSize: '11px' }}
                                />
                                <input 
                                  type="datetime-local" 
                                  value={updateArrival} 
                                  onChange={(e) => setUpdateArrival(e.target.value)}
                                  style={{ padding: '4px', fontSize: '11px' }}
                                />

                                <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                                  <button 
                                    onClick={() => handleStatusUpdate(id)} 
                                    style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={() => setEditingFlight(null)} 
                                    style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => { 
                                    setEditingFlight(id); 
                                    setUpdateStatus(f.status || 'Active');
                                    setUpdateDeparture(formatForDateTimeLocal(f.departureTime));
                                    setUpdateArrival(formatForDateTimeLocal(f.arrivalTime));
                                  }}
                                  style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  Edit Schedule/Status
                                </button>
                                <button onClick={() => handleDeleteFlight(id)} style={styles.deleteBtn}>Remove</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="8" style={styles.emptyTd}>No flights registered.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ================= BOOKING MANIFESTS TAB ================= */}
      {activeTab === 'bookings' && (
        <section style={styles.card}>
          <h2 style={styles.cardHeader}>System-Wide Booking Records</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>User ID</th>
                  <th style={styles.th}>Flight ID</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Passengers</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.bookingId} style={styles.tableRow}>
                      <td style={styles.td}><strong>#{b.bookingId}</strong></td>
                      <td style={styles.td}>{b.user?.userId || b.userId || 'N/A'}</td>
                      <td style={styles.td}>{b.flight?.flightId || b.flightId || 'N/A'}</td>
                      <td style={styles.td}>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td style={styles.td}>₹{b.totalAmount}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge}>{b.bookingStatus || 'Confirmed'}</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => fetchPassengers(b.bookingId)}
                          style={styles.viewBtn}
                        >
                          View Passengers
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" style={styles.emptyTd}>No customer bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Passenger Manifest Drawer */}
          {selectedBookingId && (
            <div style={styles.manifestBox}>
              <h3>Passenger List for Booking #{selectedBookingId}</h3>
              {selectedBookingPassengers.length > 0 ? (
                <ul>
                  {selectedBookingPassengers.map((p) => (
                    <li key={p.passengerId}>
                      <strong>{p.firstName} {p.lastName}</strong> | Gender: {p.gender} | Age: {p.age} | Passport: {p.passportNumber || 'N/A'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No passenger info found for this booking.</p>
              )}
              <button onClick={() => setSelectedBookingId(null)} style={styles.closeBtn}>Close</button>
            </div>
          )}
        </section>
      )}

      {/* ================= USER DIRECTORY TAB ================= */}
      {activeTab === 'users' && (
        <section style={styles.card}>
          <h2 style={styles.cardHeader}>Registered System Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>User ID</th>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => {
                    const userId = u.userId || u.id;
                    const fullName = u.fullName || u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A';
                    const role = u.role || 'USER';
                    const isUserAdmin = role.toUpperCase() === 'ADMIN';

                    return (
                      <tr key={userId} style={styles.tableRow}>
                        <td style={styles.td}><strong>#{userId}</strong></td>
                        <td style={styles.td}>{fullName}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: isUserAdmin ? '#dbeafe' : '#f3f4f6',
                            color: isUserAdmin ? '#1e40af' : '#374151'
                          }}>
                            {role}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.statusBadge}>{u.status || 'Active'}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="5" style={styles.emptyTd}>No users found in database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1e293b' },
  header: { marginBottom: '20px' },
  title: { fontSize: '28px', margin: '0 0 5px 0' },
  subtitle: { color: '#64748b', margin: 0 },
  tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: { padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: '600' },
  activeTab: { padding: '10px 20px', border: '1px solid #0284c7', borderRadius: '6px', backgroundColor: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: '600' },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardHeader: { fontSize: '18px', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: { padding: '8px 12px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '14px' },
  buttonWrapper: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' },
  submitBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '5px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHeaderRow: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '12px', fontSize: '13px', color: '#475569' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px', fontSize: '14px' },
  emptyTd: { padding: '20px', textAlign: 'center', color: '#94a3b8' },
  deleteBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  viewBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  statusBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  manifestBox: { marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' },
  closeBtn: { marginTop: '10px', backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' },
  errorAlert: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '15px' },
  successAlert: { backgroundColor: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '15px' },
  centerText: { textAlign: 'center', padding: '40px' }
};

export default AdminDashboard;