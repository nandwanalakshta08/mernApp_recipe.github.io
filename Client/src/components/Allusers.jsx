import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar'; 
import { useNavigate } from 'react-router-dom';

export const Allusers = () => {
      const [users,setUsers] = useState([]);

      const navigate = useNavigate();

      useEffect(()=> {
        const fetchUsers = async ()=>{
            try {
                const response = await axios.get('http://localhost:3000/api/getallusers');
                console.log("==users==",response.data.users);
                setUsers(response.data.users);
                
            } catch (error) {
                console.error("error in fetching users",error)
            }
        };
        fetchUsers();
      },[]);
    

  return (
    <>
    <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
    <h1></h1>
     {users.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '30px', marginTop: '100px' }}>No Users To Show</p>
     ) : (
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop:'73px' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>User Name</th>

                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>Gmail</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>Phone No</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>City</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>Country</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px',backgroundColor:'#1F2833' }}>state</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.first_name } {user.last_name}</td>

                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.gmail}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.phone}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.city}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.country}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.state}</td>
                    </tr>
                ))}
            </tbody>
        </table>
       
     )}
      </div>
    </div>
    </>
  )
}
