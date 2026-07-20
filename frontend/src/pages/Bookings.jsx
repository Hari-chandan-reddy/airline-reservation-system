import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../api/apiServices';

function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.userId) {
      fetchUserBookings();
    } else {
      setLoading(false);
      setError('Please log in to view your booked manifests.');
    }
  }, [user]);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserBookings(user.userId);
      setBookings(data);
    } catch (err) {
      setError('Failed to sync booking data manifests from the cloud environment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this flight reservation?')) {
      try {
        await cancelBooking(bookingId);
        alert('Reservation cancelled successfully!');
        fetchUserBookings();
      } catch (err) {
        console.error('Cancellation Error Details:', err.response);

        const errorMsg = 
          (typeof err.response?.data === 'string' ? err.response?.data : err.response?.data?.message) 
          || 'Failed to cancel booking.';
        alert(errorMsg);
      }
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>Your Booked Manifests</h2>
        <p style={{ color: '#64748b', margin: 0 }}>Review active schedules, travel itineraries, and seat configurations.</p>
      </div>

      {loading && <p style={{ color: '#1e3a8a', fontWeight: 'bold' }}>Loading itineraries...</p>}
      {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px' }}>{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>No active or past ticket purchases found on this account profile.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {bookings.map((booking) => {
            // Safely retrieve the first passenger in the booking array, defaulting to an empty object if none exist
            const primaryPassenger = (booking.passengers && booking.passengers[0]) || {};
            
            return (
              <div 
                key={booking.bookingId} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column', // Stack top content and footer vertically
                  overflow: 'hidden'
                }}
              >
                {/* TOP BOARDING PASS SECTION */}
                <div style={{ display: 'flex', flex: 1 }}>
                  {/* Left Stripe: Flight Details */}
                  <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '25px', width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '2px dashed #cbd5e1' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>Flight Number</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0' }}>{booking.flight?.flightNumber || 'N/A'}</span>
                    <span style={{ fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', marginTop: '5px' }}>
                      {booking.flight?.airlineName || 'Airline'}
                    </span>
                  </div>

                  {/* Center Area: Route & Passenger Info */}
                  <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>
                          {booking.flight?.source} ➔ {booking.flight?.destination}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                          Departure: <strong>{booking.flight?.departureTime?.replace('T', ' ') || 'N/A'}</strong>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Ticket Reference</span>
                        <strong style={{ color: '#0f172a' }}>#ARS-{booking.bookingId}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Passenger Identity</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>
                          {primaryPassenger.firstName || 'N/A'} {primaryPassenger.lastName || ''}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Passport</span>
                        <span style={{ fontWeight: '600', color: '#334155', fontSize: '13px' }}>
                          {primaryPassenger.passportNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Status</span>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: booking.bookingStatus === 'CANCELLED' ? '#ef4444' : '#10b981', 
                          fontSize: '13px' 
                        }}>
                          {booking.bookingStatus || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Seat Allocation Badge */}
                  <div style={{ padding: '25px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '130px', borderLeft: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '5px' }}>Assigned Seat</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: '8px' }}>
                      {primaryPassenger.flightSeat?.seatNumber || primaryPassenger.seatNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* BOTTOM ACTION FOOTER */}
                <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '12px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    * Policy: Cancellations are allowed up to 24 hours before departure.
                  </span>

                  {booking.bookingStatus !== 'CANCELLED' ? (
                    <button
                      onClick={() => handleCancel(booking.bookingId)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      Cancel Reservation
                    </button>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px', backgroundColor: '#fef2f2', padding: '4px 12px', borderRadius: '4px' }}>
                      Cancelled
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;