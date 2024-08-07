import React from 'react'
import { Link } from 'react-router-dom';
import Allrecipe from './Allrecipe';
import Difficulty from './Difficulty';

const Adminpnlx = () => {
  return (
    <div style={{display:'flex', height:'100vh'}}>
      <div style={{width:'250px',backgroundColor:'#2C3539',color:'#fff',padding:'15px',height:'100vh',position:'fixed'}}>
        <h2>Admin Panel</h2>
        <ul style={{listStyleType:'none',padding:0}}>
          <li style={{marginBottom:'10px'}}>
            <Link to="/allrecipe" style={{color:'#fff',textDecoration:'none'}}>All Recipes</Link> <br></br>
            <Link to="/difficulty" style={{color:'#fff',textDecoration:'none'}}>Difficulty</Link> <br></br>       
            <Link to="/category" style={{color:'#fff',textDecoration:'none'}}>Category</Link> <br></br>
            <Link to="/cuisine" style={{color:'#fff',textDecoration:'none'}}>Cuisine</Link> <br></br>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Adminpnlx