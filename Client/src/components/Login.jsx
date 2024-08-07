import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({gmailOrPhone:'',password:'',confirmPassword:''});
  const [showPassword,setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors,setErrors] = useState({})
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if(!formData.gmailOrPhone) newErrors.gmailOrPhone = '*gmail or Phone is mandatory to be filled...';
    if(!formData.password) newErrors.password = '*password is mandatory to be filled...';
    // if(!formData.confirmPassword) newErrors.confirmPassword = '*confirm password is mandatory to be filled...';
    
    // if(formData.password !== formData.confirmPassword) newErrors.confirmPassword = '*passwords not matched';
    
    setErrors(newErrors);

    if(Object.keys(newErrors).length > 0){
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        gmailOrPhone: formData.gmailOrPhone,
        password: formData.password
      });
      console.log(response.data);
      
      if(response.data.message === "Invalid Credentials"){
        toast.error(response.data.message, {
          position:'top-right',
          autoClose: 1000,
          theme:"dark",
          transition: Bounce,
        });
      }else if (response.data.message == "User Not Exist"){
      toast.error(response.data.message , {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
        });
    }else {
      localStorage.setItem('authToken', response.data.token);
      
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user info

      toast.success(response.data.message, {
        onClose: () => navigate('/home'),
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
     
    
    }
    
    } catch (error) {
      toast.error('There was an error logging in the user!', {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      console.error('error in logging', error);
    }
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const confirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword)
  // };

  return (
  
    <>
       <h1></h1>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', maxWidth:'500px', marginTop:'50px',marginLeft:'520px', padding:'20px', border:'0.1px solid grey', borderRadius:'10px', backgroundColor:'black'}}>
      <h2 style={{textAlign:'center', margin:'20px',fontSize:'25px', color:"white", marginTop:"0"}}>Login for Home</h2>
        <div style={{marginBottom:'15px'}}>
          <input placeholder='Enter Gmail or Phone No.' type="text" name="gmailOrPhone" value={formData.gmailOrPhone} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px'}}/>
          {errors.gmailOrPhone && <p style={{ color: 'red', fontSize: '14px', marginTop: '1px' }}>{errors.gmailOrPhone}</p>}
        </div>

        <div style={{marginBottom:'15px', position:'relative'}}>
          <div style={{display:'flex', alignItems:'center'}}>
            <input placeholder='Enter Password' type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px'}}/>
            <button type="button" onClick={passwordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px'}}>{showPassword ? <FaEyeSlash/> : <FaEye/>}</button>
          </div>
          {errors.password && <p style={{ color: 'red', fontSize: '14px', marginTop: '1px' }}>{errors.password}</p>}
        </div>


        <div>
          <h3 style={{fontSize:'15px', color:'white', textAlign:'center', fontWeight:'light'}}>Didn't register yet, <Link style={{color:''}} to={"/"}>Register</Link> Instead ?</h3>
        </div>

        <div>
          <h3 style={{fontSize:'13px', color:'white', textAlign:'center', fontWeight:'light'}}>Didn't remember password, <Link to={"/Forgotpassword"}>Forgot Password</Link> ?</h3>
        </div>

        <button type="submit" style={{padding: '10px',color:'white', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: '#fff', fontSize: '16px', cursor: 'pointer'}}>Log in</button>

      </form>
      <ToastContainer />
    </>
  );
};

export default Login;
