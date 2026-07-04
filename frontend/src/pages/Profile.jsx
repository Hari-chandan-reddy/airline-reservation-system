import React from 'react';

function Profile({ user }) {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Account Settings</h2>
      <p><strong>User ID:</strong> {user?.userId}</p>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </div>
  );
}

export default Profile;