import React, { useState, useEffect } from 'react';
import { getAllFlights, searchFlights, createBooking, getFlightSeats } from '../api/apiServices';

function Home({ user }) {
  // Flight Search & Grid States
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Active Selection Workspace State
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightSeats, setFlightSeats] = useState([]);

  // Form Input Mapping matches the exact backend BookingRequestDTO expectation
  const [seatNumber, setSeatNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    loadAllFlights();
  }, []);

  // Fetch seats whenever a flight is selected
  useEffect(() => {
    if (selectedFlight) {
      fetchSeatsForFlight(selectedFlight.flightId);
    }
  }, [selectedFlight]);

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

  const fetchSeatsForFlight = async (flightId) => {
    try {
      const data = await getFlightSeats(flightId);
      setFlightSeats(data);
    } catch (err) {
      setError('Failed to load seat map configurations for this aircraft.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const filteredData = await searchFlights(source, destination);
      setFlights(filteredData);
      if (filteredData.length === 0) setError('No active schedules found matching this route.');
    } catch (err) {
      setError('Query execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSource('');
    setDestination('');
    loadAllFlights();
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!seatNumber) {
      setError('Please select a preferred seat from the aircraft map layout before checking out.');
      return;
    }
    setLoading(true);
    setError('');

    const bookingPayload = {
      userId: user.userId,
      flightId: selectedFlight.flightId,
      seatNumber,
      firstName,
      lastName,
      gender,
      age: parseInt(age),
      passportNumber,
      paymentMethod
    };

    try {
      await createBooking(bookingPayload);
      setBookingSuccess(`Ticket successfully secured! Your flight allocation is complete.`);
      
      // Reset form controls
      setSeatNumber('');
      setFirstName('');
      setLastName('');
      setAge('');
      setPassportNumber('');
      
      setTimeout(() => {
        setBookingSuccess('');
        setSelectedFlight(null);
        loadAllFlights();
      }, 500);
    } catch (err) {
      setError(err.response?.data || 'Transaction aborted. Please check seat allocation parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* VIEW STATE 1: Browse & Search Catalog Screen */}
      {!selectedFlight ? (
        <div>
          <div style={{ marginBottom: '25px' }}>
            <h2>Welcome back, {user?.fullName || 'Passenger'}!</h2>
            <p style={{ color: '#666', margin: 0 }}>Explore current listings or input custom route trajectories to book tickets.</p>
          </div>
          
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '20px', backgroundColor: '#f8fafc', 
            padding: '25px', borderRadius: '8px', alignItems: 'flex-end',
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
              <button type="submit" disabled={loading} style={{ backgroundColor: '#1e3a8a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px' }}>
                Search
              </button>
              {(source || destination) && (
                <button type="button" onClick={handleClearSearch} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px' }}>
                  Clear
                </button>
              )}
            </div>
          </form>

          {loading && <p style={{ textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold' }}>Syncing data grids...</p>}
          {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px' }}>{error}</p>}

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
                      }} onClick={() => setSelectedFlight(flight)}>
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
      ) : (
        
        /* VIEW STATE 2: Passenger Manifest Checkout Screen */
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '35px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <button onClick={() => { setSelectedFlight(null); setSeatNumber(''); }} style={{ backgroundColor: '#64748b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
            ➔ Back to Flight Listings
          </button>
          
          <h3 style={{ color: '#1e3a8a', margin: '0 0 5px 0' }}>Passenger Manifest & Seat Selection</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
            Securing configuration details on <strong>{selectedFlight.flightNumber}</strong> ({selectedFlight.source} to {selectedFlight.destination})
          </p>

          {bookingSuccess && <p style={{ color: '#10b981', backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{bookingSuccess}</p>}
          {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>{error}</p>}

          {/* VISUAL SEAT MAP COMPONENT GRID */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#334155' }}>Select Your Preferred Seat:</h4>
            
            {/* Compact Status Indicator Legend */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }}></div> Available</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '3px' }}></div> Booked</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#1e3a8a', borderRadius: '3px' }}></div> Selected</div>
            </div>

            {/* Simulated Aircraft Body Container */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '25px 15px',
              borderRadius: '12px',
              border: '2px solid #cbd5e1',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {/* 6-Column Grid Layout (A A A [Aisle Space] B B B) */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 25px) 15px repeat(3, 25px)', 
                gap: '10px 8px', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {flightSeats.map((seat, index) => {
                  const isBooked = !"Available".equalsIgnoreCase(seat.status);
                  const isSelected = seatNumber === seat.seatNumber;
                  
                  let bgColor = '#10b981'; // Green (Available)
                  if (isBooked) bgColor = '#ef4444'; // Red (Booked)
                  if (isSelected) bgColor = '#1e3a8a'; // Deep Blue (Selected)

                  // Add a blank spacer row to separate columns into a realistic left/right aisle configuration
                  const showAisleSpacer = index % 6 === 3;

                  return (
                    <React.Fragment key={seat.flightSeatId}>
                      {/* Inject a label or empty space to represent the cabin aisle walkway */}
                      {showAisleSpacer && (
                        <div style={{ gridColumn: '4', textAlign: 'center', color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}>
                          |
                        </div>
                      )}
                      
                      <button
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSeatNumber(seat.seatNumber)}
                        title={`Seat ${seat.seatNumber} - Class: ${seat.seatClass || 'Economy'} - Price: ₹${seat.price}`} // Native browser hover tooltip
                        style={{
                          backgroundColor: bgColor,
                          color: 'white',
                          border: 'none',
                          height: '25px',
                          width: '25px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #1e3a8a' : '0 1px 2px rgba(0,0,0,0.15)',
                          transition: 'transform 0.1s ease, background-color 0.2s',
                          transform: isSelected ? 'scale(1.05)' : 'none'
                        }}
                      >
                        {seat.seatNumber}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            
            {seatNumber && (
              <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#475569', fontSize: '14px' }}>Selected Seat:</span>
                <span style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  {seatNumber}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleConfirmBooking}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>First Name</label>
                <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Last Name</label>
                <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Gender</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '38px' }} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Age</label>
                <input type="number" required min="1" max="120" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} value={age} onChange={e => setAge(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Passport Number</label>
              <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} value={passportNumber} onChange={e => setPassportNumber(e.target.value)} />
            </div>

            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Payment Method</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="" disabled>Select Payment Method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI / Wallet">UPI / Wallet</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {loading ? 'Processing Transaction...' : 'Confirm Flight & Process Payment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Helper logic to safely evaluate case insensitivity in JavaScript
if (!String.prototype.equalsIgnoreCase) {
  String.prototype.equalsIgnoreCase = function (str) {
    return this.toLowerCase() === str?.toLowerCase();
  };
}

export default Home;