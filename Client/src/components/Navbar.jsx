import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login')
  }



  return (
    <>
    <div className='navbar navbar-light bg-dark p-2 d-flex justify-content-between ' style={{backgroundColor:" #e3f2fd"}}>
     <div className="left">
       <Link to={"/"} style={{textDecoration:'none' ,color:'white'}}><h2>HOME</h2></Link>
     </div>

     <div className="right">
      {!authToken ? (
        <>
          <Link to={"/login"} className="btn btn-primary mx-2">Login</Link>
          <Link to={"/"} className="btn btn-info mx-2">Register</Link>
          <Link to={"/profile"} className="btn btn-light mx-2">Profile</Link>
        </>
      ) : (
        <>
         <Link to={"/profile"} className="btn btn-light mx-2">Profile</Link>
         {user && user.its_admin === 0 && (
            <Link to={"/adminpnlx"} className="btn btn-info mx-2">Admin</Link>
         )}
         
         <button onClick={handleLogout} className='btn btn-danger mx-2'>Log Out</button>
       
        </>
      )}
        
       
     </div>
     </div>
    </>
  )
}

export default Navbar