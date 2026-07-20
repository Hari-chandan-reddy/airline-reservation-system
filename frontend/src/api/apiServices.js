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
  // Pass both email and password as an object body payload to match the Java entity expectation
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
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

const cancelBooking = async (bookingId) => {
  const response = await apiClient.put(`/bookings/${bookingId}/cancel`);
  return response.data;
}

export {
  getAllFlights,
  searchFlights,
  loginUser,
  createBooking,
  registerUser,
  getFlightSeats,
  getUserBookings,
  cancelBooking
};