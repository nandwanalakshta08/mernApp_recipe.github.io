import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logout from './Logout';
import { FaHome } from "react-icons/fa";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogoutClick = () => {
    setShowLogout(true);
  };

  return (
    <>
    <div className='navbar navbar-light bg-dark p-2 d-flex justify-content-between ' style={{backgroundColor:" #1F2833"}}>
     <div className="left">
     <Link to="/" style={{display: 'flex',padding:'10px' }}>
  <FaHome style={{fontSize: '36px',color: 'white',cursor: 'pointer',margin: '0 auto',}}/>
</Link>

     </div>

     <div className="right">
      {!authToken ? (
        <>
            <Link to={"/register"} className="btn btn-info mx-2">Register</Link>
          <Link to={"/login"} className="btn btn-info mx-2">Login</Link>
         </>
      ) : (
        <>
         <Link to={"/profile"} className="btn btn-light mx-2">Profile</Link>
         {user && user.its_admin === 0 && (
            <Link to={"/adminpnlx"} className="btn btn-info mx-2">Admin</Link>
         )}
         <button onClick={handleLogoutClick} className='btn btn-danger mx-2'>Log Out</button>
       
        </>
      )}
        
       
     </div>
     </div>
     {showLogout && <Logout onClose={() => setShowLogout(false)} />}
    </>
  )
}

export default Navbar