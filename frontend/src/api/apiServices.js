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

// 3. User Login validation against database records
const loginUser = async (email) => {
  const response = await apiClient.get('/users');
  const user = response.data.find(u => u.email === email);
  if (!user) throw new Error("Authentication failed");
  return user;
};

// 4. Securely transmit Passenger manifest details
const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export {
  getAllFlights,
  searchFlights,
  loginUser,
  createBooking,
};