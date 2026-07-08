import React from 'react';

function Home({ user }) {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Booking Engine, {user?.fullName}!</h1>
      <p>This is where flight search table and booking system will live.</p>
    </div>
  );
}

export default Home;