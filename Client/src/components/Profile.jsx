import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', gmail: '', city: '', pincode: '', address_line_1: '', address_line_2: '', country: '', state: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data.user);
        console.log('response.data.user : ', response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
 fetchProfile();
  }, []);

  const validateField = (name, value) => {
    let error = '';
    if (!value){
      error = `${name.replace('_', ' ')} is mandatory to be filled`;
    }else{
      if (name === 'phone' && !/^\d{10}$/.test(value)){
        error = '*phone must be of exactly 10 digits';
     }else if (name === 'pincode' && !/^\d*$/.test(value)){
        error = `*only numbers are allowed in ${name} field`;
  }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
   setFormData({...formData, [name]: value });
   setErrors({...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   // console.log('submitting');
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      console.log('key: ',newErrors);
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error; }
    });
    setErrors(newErrors);
    console.log('newErrors : ', newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log('error: ', errors);
      console.log('Object.keys(newErrors).length : ', Object.keys(newErrors).length);
      return;
    }

    const token = localStorage.getItem('authToken');
    try {
      console.log('sending to backend:',formData);
      const response = await axios.put('http://localhost:3000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('response from backend:',response.data ) 
     if (response.data.message === "Profile updated successfully") {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop:'20px',marginLeft:'400px',width:'700px', padding: '20px', border: '0.5px solid white', borderRadius: '10px', backgroundColor: '#2C3539' }}>
        <h2 style={{fontWeight:'bold',textAlign:'center'}}>Your Profile Details</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.first_name ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.first_name && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.first_name}</p>}
        </div>
       
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.last_name ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.last_name && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.last_name}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Gmail:</label>
          <input type="text" name="gmail" value={formData.gmail} onChange={handleChange} disabled style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: '#f0f0f0' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.phone ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.phone && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.phone}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.city ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.city && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.city}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Pincode:</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.pincode ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.pincode && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.pincode}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Address Line 1:</label>
          <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_1 ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.address_line_1 && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.address_line_1}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Address Line 2:</label>
          <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_2 ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.address_line_2 && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.address_line_2}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.country ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.country && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.country}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.state ? '1px solid red' : '1px solid #ccc', fontSize: '15px' }} />
          {errors.state && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.state}</p>}
        </div>
        
        <div>
          <h3 style={{fontSize:'15px', color:'white',marginBottom:'10px',marginTop:'5px',textAlign:'end', fontWeight:'light'}}>want to change password, <Link to={"/Change-password"}>Change Password</Link> </h3>
        </div>
        <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>Update Profile</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Profile = () => {
//   const [formData, setFormData] = useState({
//     first_name: '', last_name: '', gmail: '', city: '', pincode: '', address_line_1: '', address_line_2: '', country: '', state: '', phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('authToken');
//       try {
//         const response = await axios.get('http://localhost:3000/api/profile', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setFormData(response.data.user);
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const validateField = (name, value) => {
//     let error = '';
//     if (!value) {
//       error = `${name.replace('_', ' ')} is mandatory to be filled`;
//     } else {
//       if (name === 'phone' && !/^\d{10}$/.test(value)) {
//         error = '*phone must be of exactly 10 digits';
//       } else if (name === 'pincode' && !/^\d*$/.test(value)) {
//         error = `*only numbers are allowed in ${name} field`;
//       }
//     }
//     return error;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const error = validateField(name, value);

//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     setErrors({
//       ...errors,
//       [name]: error
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     Object.keys(formData).forEach(key => {
//       const error = validateField(key, formData[key]);
//       if (error) {
//         newErrors[key] = error;
//       }
//     });
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       return;
//     }

//     const token = localStorage.getItem('authToken');
//     try {
//       const response = await axios.put('http://localhost:3000/api/profile', formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.message === "Profile updated successfully") {
//         toast.success(response.data.message, {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Bounce,
//         });
//       } else {
//         toast.error(response.data.message, {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Bounce,
//         });
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error('Failed to update profile', {
//         position: "top-right",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//         transition: Bounce,
//       });
//     }
  
//   };

//   return (
//     <div>
//       <h1></h1>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>First Name:</label>
//           <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.first_name ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.first_name && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.first_name}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Last Name:</label>
//           <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.last_name ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.last_name && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.last_name}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Gmail:</label>
//           <input type="text" name="gmail" value={formData.gmail} onChange={handleChange} disabled style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#f0f0f0' }} />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Phone:</label>
//           <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.phone ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.phone && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.phone}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>City:</label>
//           <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.city ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.city && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.city}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Pincode:</label>
//           <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.pincode ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.pincode && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.pincode}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Address Line 1:</label>
//           <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_1 ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.address_line_1 && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.address_line_1}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Address Line 2:</label>
//           <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_2 ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.address_line_2 && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.address_line_2}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>Country:</label>
//           <input type="text" name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.country ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.country && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.country}</p>}
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'black' }}>State:</label>
//           <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.state ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
//           {errors.state && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.state}</p>}
//         </div>
//         <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>Update Profile</button>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Profile;


// import React, { useContext } from 'react'
// import { AppContext } from '../context/App_Context'
// const Profile = () => {
//   const {user, userRecipe} = useContext(AppContext);
//   console.log('user', user)
//   return (
//     <>
//     <div className="container text-center my-3">
//       <h1>Welcome!!, {user?.name} </h1>
//       <h2>{user?.gmail}</h2>
//     </div>

//     <div className="container">
//     <div className="text-center mx-auto" style={{width:'1200px'}}>
//        <div className="row d-flex justify-content-center align-items-center">
//       {
//        userRecipe?.map((data)=> <div key = {data._id} className='col-md-3 my-3 '>
        
//         <div className=' d-flex justify-content-center align-items-center p-3'>

//         <img style={{width:'200px', height:'200px', borderRadius:'10px', border:'2px solid yellow'}} src={data.imgUrl} className="card-img-top" alt="..."/>
//         </div>
 
//   <div className="card-body">
//     <h5 className="card-title">{data.title}</h5>
    
   
//   </div>

//        </div>)
//       }
//     </div>
//     </div>
//     </div>
//     </>
//   );
// }

// export default Profile