import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
        <p style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Are You Sure To LOGOUT?</p>
        <button onClick={handleLogout} style={{ width: '100px', marginRight: '10px', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Yes</button>
        <button onClick={onClose} style={{ width: '100px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>No</button>
      </div>
    </div>
  );
};

export default Logout;




