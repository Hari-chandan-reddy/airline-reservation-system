import apiClient from './apiClient';

// 1. Fetch all flights out of MySQL
const getAllFlights = async () => {
  const response = await apiClient.get('/flights');
  return response.data;
};

// 2. Search flights based on specific Source and Destination parameters
const searchFlights = async (source, destination) => {
  const response = await apiClient.get('/flights/search', {
    params: { source, destination },
  });
  return response.data;
};

// 3. User Login validation against database records via POST payload
const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  
  // 1. Extract token and user from backend response
  const { token, user } = response.data;
  
  // 2. Store token in localStorage for Axios interceptor
  if (token) {
    localStorage.setItem('token', token);
  }
  
  // 3. Return user object to Login.jsx
  return user; 
};

// 4. Securely transmit Passenger manifest details
const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

// 5. New User Registration handling POST payload (Hashed on backend)
const registerUser = async (fullName, email, password) => {
  // Payloads map perfectly to the Java 'User' entity fields: fullName, email, password
  const response = await apiClient.post('/auth/register', { fullName, email, password });
  return response.data;
}

// 6. Fetch all seats assigned to a specific flight ID
const getFlightSeats = async (flightId) => {
  const response = await apiClient.get(`/flights/${flightId}/seats`);
  return response.data;
};

// 7. Fetch all bookings for a specific user ID
const getUserBookings = async (userId) => {
  const response = await apiClient.get(`/bookings/user/${userId}`);
  return response.data;
};

// 8. Cancel a specific booking by its ID
const cancelBooking = async (bookingId) => {
  const response = await apiClient.put(`/bookings/${bookingId}/cancel`);
  return response.data;
}

// 9. Admin-specific API calls for flight and booking management
const getAdminFlights = async () => {
  const response = await apiClient.get('/flights/admin/all');
  return response.data;
};

// 10. Admin-specific API call to fetch all bookings across the system
const getAdminBookings = async () => {
  const response = await apiClient.get('/bookings/admin/all');
  return response.data;
};

// 11. Admin-specific API call to fetch all passengers for a specific booking
const getBookingPassengers = async (bookingId) => {
  const response = await apiClient.get(`/bookings/${bookingId}/passengers`);
  return response.data;
};

// 12. Admin-specific API call to update flight details (status, departure, arrival)
const createFlight = async (flightData) => {
  const response = await apiClient.post('/flights', flightData);
  return response.data;
};

// 13. Admin-specific API call to delete a flight by its ID
const deleteFlight = async (flightId) => {
  const response = await apiClient.delete(`/flights/${flightId}`);
  return response.data;
};

// 14. Admin-specific API call to update flight status, departure time, and arrival time
const updateFlightStatus = async (flightId, { status, departureTime, arrivalTime }) => {
  const response = await apiClient.put(`/flights/${flightId}/status`, null, {
    params: { status, departureTime, arrivalTime }
  });
  return response.data;
};

// 15. Admin-specific API call to fetch all registered users in the system
const getAdminUsers = async () => {
  const response = await apiClient.get(`/auth`);
  return response.data;
};

export {
  getAllFlights,
  searchFlights,
  loginUser,
  createBooking,
  registerUser,
  getFlightSeats,
  getUserBookings,
  cancelBooking,
  getAdminFlights,
  getAdminBookings,
  getBookingPassengers,
  createFlight,
  deleteFlight,
  updateFlightStatus,
  getAdminUsers
};