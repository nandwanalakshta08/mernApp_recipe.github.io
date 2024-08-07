import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Msg = () => {
    
  const navigate = useNavigate();
  return (
    <div style={{marginTop:'150px',marginLeft:'480px', width:'600px', padding:'20px', border:'0.5px solid white',borderRadius:'10px',backgroundColor:'#2C3539'}}>
        <h2 style={{textAlign:'center',margin:'auto'}}>Not Authorised to visit this page!</h2>
    </div>
  )
}

export default Msg