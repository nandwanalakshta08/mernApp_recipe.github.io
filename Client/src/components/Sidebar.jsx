
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#2C3539', color: '#fff', padding: '15px', height: '100vh', position: 'fixed' }}>
      <h2>Admin Panel</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}>
          <Link to="/allrecipe" style={{ color: '#fff', textDecoration: 'none' }}>All Recipes</Link> <br />
          <Link to="/difficulty" style={{ color: '#fff', textDecoration: 'none' }}>Difficulty</Link> <br />
          <Link to="/category" style={{ color: '#fff', textDecoration: 'none' }}>Category</Link> <br />
          <Link to="/cuisine" style={{ color: '#fff', textDecoration: 'none' }}>Cuisine</Link> <br />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
