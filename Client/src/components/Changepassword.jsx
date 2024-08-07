import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({currentPassword: '', newPassword: '', confirmNewPassword: '',});
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: ''});
  };

  const validate = () => {
    const newErrors = {};
    const passwordtest = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!passwordtest.test(formData.newPassword)) {
      newErrors.newPassword = 'New password must be at least 8 characters long, including atleast one number and special character with letters';
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(
        'http://localhost:3000/api/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("==output==",response.data)

      if (response.data.message === "Current password is incorrect"){
        toast.error(response.data.message , {
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
      } else if(response.data.message === "User not found"){
        toast.error(response.data.message , {
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
      }else {
        toast.success(response.data.message, {
            onClose: () => navigate('/profile'),
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
      toast.error("Failed to change password", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
      console.log("==error in changing==",error)
    }
  };

  const currentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const newPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const confirmPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  return (
    <div>
     
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', marginTop:'60px',marginLeft:'430px', width:'700px', padding:'70px', border:'0.5px solid white',borderRadius:'10px',backgroundColor:'#2C3539'}}>
        <h2 style={{textAlign:'center',marginTop:'-40px',marginBottom:'20px'}}>Change Your Password</h2>
        <div style={{marginBottom:'10px',position:'relative'}}>
          <label style={{marginBottom: '5px',fontWeight: 'light',color: 'white'}}>Current Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={formData.currentPassword} onChange={handleChange} style={{width: '100%',padding: '10px',borderRadius: '5px',border: errors.currentPassword ? '1px solid red' : '1px solid #ccc' ,fontSize: '12px'}}/>
            <button type="button" onClick={currentPasswordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px' }}>{showCurrentPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          {errors.currentPassword && <span style={{color: 'red', fontSize: '14px'}}>{errors.currentPassword}</span>}
          </div>

        <div style={{marginBottom: '15px',position:'relative'}}>
          <label style={{ marginBottom: '5px', fontWeight: 'light', color: 'white'}}>New Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type={showNewPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange} style={{width: '100%',padding: '10px',borderRadius: '5px',border: errors.newPassword ? '1px solid red' : '1px solid #ccc' ,fontSize: '12px'}}/>
            <button type="button" onClick={newPasswordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px' }}>{showNewPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          {errors.newPassword && <span style={{ color: 'red', fontSize: '14px'}}>{errors.newPassword}</span>}
        </div>

        <div style={{marginBottom: '15px',position:'relative'}}>
          <label style={{marginBottom: '5px',fontWeight: 'light',color: 'white'}}>Confirm New Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type={showConfirmNewPassword ? 'text' : 'password'} name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} style={{width: '100%',padding: '10px',borderRadius: '5px',border: errors.confirmNewPassword ? '1px solid red' : '1px solid #ccc' ,fontSize: '12px'}}/>
            <button type="button" onClick={confirmPasswordVisibility} style={{ position: 'absolute', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px' }}>{showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          {errors.confirmNewPassword && <span style={{color: 'red',fontSize: '14px'}}>{errors.confirmNewPassword}</span>}
        </div>

        <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', cursor: 'pointer'}}>Change Password</button>
      </form>
      <ToastContainer />
    </div>
  );
};


export default ChangePassword;


