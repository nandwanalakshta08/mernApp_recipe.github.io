import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', gmail: '', password: '',confirmPassword:'', city: '', pincode: '', address_line_1: '', address_line_2: '', country: '', state: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
  if (!value) {
      error = `${name.replace('_', ' ')} is mandatory to be filled`;
   } else {
      switch (name) {
        case 'phone':
          if (!/^\d{10}$/.test(value)) {error = '*phone must be of exactly 10 digits';} break;
          
        case 'pincode':
          if (!/^\d*$/.test(value)) {error = `*only numbers are allowed in ${name} field`;} break;
          
        case 'gmail':
          if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {error = '*enter a valid email address';} break;
          
        case 'password':
          if (value.length < 8) {
            error = '*password must be at least 8 characters long';
          } else if (!/^(?=.*[A-Za-z])(?=.*[@$!%*?&])(?=.*\d).{8,}$/.test(value)) {
            error = '*password must include at least one letter, one number, and one special character';
          }
          
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            setErrors(errors => ({ ...errors, confirmPassword: '*passwords not matched' }));
          } else {
            setErrors(errors => ({ ...errors, confirmPassword: '' }));
          }
          break;
          
        case 'confirmPassword':
          // Validate confirm password
          if (value !== formData.password) {
            error = '*passwords not matched';
          } else {setErrors(errors => ({ ...errors, confirmPassword: '' }));
            }
          break;
          default:
          break;
      }
    }
  return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
   
    try {
     const response = await axios.post('http://localhost:3000/api/register', formData);
      console.log(response.data);

      const {message} = response.data;

      if(message === "User Registered Successfully..!"){
        toast.success(message,{
          onClose: () => navigate('/login'),
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        })
      } else {
        toast.error(message,{
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        })
      }
   
    } catch (error) {
      console.error('There is an error', error);
      toast.error('Failed to register',{
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })
    }
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const confirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };


  return (
    <div>
      <h1></h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', marginTop:'50px',marginLeft:'500px', padding: '20px', border: '1px solid grey', borderRadius: '10px', backgroundColor: 'black' }}>
      <h2 style={{textAlign:'center', margin:'20px', fontSize:'25px', color:"white", marginTop:"0"}}>CREATE NEW REGISTRATION</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.first_name ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.first_name && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.first_name}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.last_name ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.last_name && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.last_name}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Email:</label>
          <input type="email" name="gmail" value={formData.gmail} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.gmail ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.gmail && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.gmail}</p>}
        </div>

        <div style={{ marginBottom: '15px', position: 'relative' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.password ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
            <button type="button" onClick={passwordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px' }}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          {errors.password && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.password}</p>}
        </div>

        <div style={{ marginBottom: '15px', position: 'relative' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Confirm Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>

            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.confirmPassword ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
            <button type="button" onClick={confirmPasswordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px'}}>{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}</button>
          </div>
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.confirmPassword}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.city ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.city && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.city}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Pincode:</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.pincode ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.pincode && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.pincode}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Address Line 1:</label>
          <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_1 ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.address_line_1 && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.address_line_1}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Address Line 2:</label>
          <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.address_line_2 ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.address_line_2 && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.address_line_2}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.country ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.country && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.country}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.state ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.state && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.state}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 'bold', color: 'white' }}>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: errors.phone ? '1px solid red' : '1px solid #ccc', fontSize: '16px' }} />
          {errors.phone && <p style={{ color: 'red', fontSize: '12px', marginTop: '1px' }}>{errors.phone}</p>}
        </div>
         <div>
         <h3 style={{fontSize:'14px', color:'white', textAlign:'center', fontWeight:'light',marginTop:'5px',marginBottom:'15px'}}>Already registered, <Link to={"/login"}>Login</Link> Instead ?</h3>
         </div>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>Register</button>
     </form>
      <ToastContainer />
    </div>
  );
};

export default Register;

  
  // const validateField = (name, value) => {
  //   let error = '';
  //   if (!value) {
  //     error = `${name.replace('_', ' ')} is mandatory to be filled`;
  //   }else {
  //     if (name === 'phone' && !/^\d{10}$/.test(value) ) {
  //       if (!/^\d{10}$/.test(value)) {
  //         error = '*phone must be of exactly 10 digits';
  //       }
  //     } else if (name === 'pincode' && !/^\d*$/.test(value)) {
  //       error = `*only numbers are allowed in ${name} field`;
  //     } else if (name === 'gmail' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
  //       error = '*enter a valid email address';
  //     } else if (name === 'password') {
  //       if (value.length < 8) {
  //         error = '*password must be at least 8 characters long';
  //       } else if (!/^(?=.*[A-Za-z])(?=.*[@$!%*?&])(?=.*\d).{8,}$/.test(value)) {
  //         error = '*password must include at least one letter and one special character with letters';
  //       }
  //     } else if(name === "confirmPassword"){
  //       console.log('confirmPassword :>> ', formData.confirmPassword);
  //       console.log('formData.password :>> ', formData.password);
  //       if (formData.confirmPassword !== formData.password) {
  //         console.log('password not match');
  //         error = '*passwords not matched';
  //       }
  //     }
  //   }
  //   return error;
  // };