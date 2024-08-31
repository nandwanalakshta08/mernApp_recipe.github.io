import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{width: '250px',backgroundColor: '#1F2833',color: 'white',padding: '20px',height: '100vh',position: 'fixed',boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',display: 'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
      <div>
        <h2 style={{color: '#daeaeb',borderBottom: '2px solid #78aaad',paddingBottom: '10px',marginBottom: '20px',fontSize: '22px',textAlign: 'center'}}>Admin Panel</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{marginBottom: '15px', fontSize: '18px',textAlign: 'center'}}>
          <Link to="/" style={{color: 'white',textDecoration: 'none',display: 'block',padding: '10px 0',borderRadius: '5px',transition: 'background-color 0.3s',}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Home</Link>
            <Link to="/allrecipe" style={{color: 'white',textDecoration: 'none',display: 'block',padding: '10px 0',borderRadius: '5px',transition: 'background-color 0.3s',}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>All Recipes</Link>
            <Link to="/difficulty" style={{ color: 'white', textDecoration: 'none',
              display: 'block',
              padding: '10px 0',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >Difficulty</Link>
            <Link to="/category" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 0',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >Category</Link>
            <Link to="/cuisine" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'block',
              padding: '10px 0',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >Cuisine</Link>
               <Link to="/review" style={{ color: 'white', textDecoration: 'none',
              display: 'block',
              padding: '10px 0',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >Reviews</Link>
              <Link to="/allusers" style={{ color: 'white', textDecoration: 'none',
              display: 'block',
              padding: '10px 0',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#78aaad'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >All Users</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

