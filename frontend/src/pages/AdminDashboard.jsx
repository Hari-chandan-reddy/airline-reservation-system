import React from 'react';

function AdminDashboard({ user }) {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h2>⚡ Admin Control Center</h2>
      <p style={{ color: '#64748b' }}>
        Welcome, {user?.firstName || user?.name || 'Admin'}. Manage flights, system metrics, and customer manifests.
      </p>

      <div style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', marginTop: '20px' }}>
        <p style={{ margin: 0, color: '#334155' }}>
          Admin Route Active!
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;