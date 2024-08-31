import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [gmail, setGmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState('sendOtp'); 
  const[loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    if (!gmail) {
      toast.error('Enter Email Id!', {
            position:'top-right',
            autoClose: 1000,
            theme:"dark",
            transition: Bounce,
          });
      return;
    }
    setLoading(true);
    try{
      const response = await axios.post('http://localhost:3000/api/sendotp', { gmail });

      console.log("==response from sendotp==",response.data);

      if(response.data.message === "OTP Sent Successfully"){
            toast.success(response.data.message, {
                  position: "top-right",
                  autoClose: 1000,
                  theme: "dark",
                  transition: Bounce,
                });
      }else if(response.data.message === "User not found"){
            toast.error(response.data.message, {
                  position:'top-right',
                  autoClose: 1000,
                  theme:"dark",
                  transition: Bounce,
                });
      }else {
            toast.error(response.data.message, {
                  position:'top-right',
                  autoClose: 1000,
                  theme:"dark",
                  transition: Bounce,
                });
      }
      if (response.data.message === 'OTP Sent Successfully') {
        setCurrentStep('verifyOtp');
      }
    } catch (error) {
      toast.error("Failed to send OTP!" , {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
            });
    } finally{
      setLoading(false)
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP First!", {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
            });
      return;
    }
    setLoading(true);
   try{
      const response = await axios.post('http://localhost:3000/api/verifyotp', { gmail , otp });
      
      if(response.data.message === "OTP Verified Successfully"){
            toast.success(response.data.message, {
                  position: "top-right",
                  autoClose: 1000,
                  theme: "dark",
                  transition: Bounce,
                });
      }else if(response.data.message === "Invalid OTP!"){
            toast.error(response.data.message, {
                  position:'top-right',
                  autoClose: 1000,
                  theme:"dark",
                  transition: Bounce,
                });
      }else {
            toast.error(response.data.message, {
                  position:'top-right',
                  autoClose: 1000,
                  theme:"dark",
                  transition: Bounce,
                });
      }
      if (response.data.message === 'OTP Verified Successfully') {
        setCurrentStep('resetPassword');
      }
    } catch (error) {
      toast.error(response.data.message , {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
            });
    }finally{
      setLoading(false);
    }
  };

  const handleResetPassword = async () =>{
      const passwordValid = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!newPassword || !confirmPassword){
      toast.error('Enter and Confirm Your New Password!', {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
          });
      return;
    }
    if(!passwordValid.test(newPassword)){
      toast.error('it must be atleast 8 characters long with atleast one letter,special character,number', {
            position: "top-right",
            autoClose: 2000,
            theme: "dark",
            transition: Bounce,
          });
          return;
    }
   if (newPassword !== confirmPassword){
      toast.error('PASSWORD Not Matched!', {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
          });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/resetpassword',{ gmail, newPassword });
      
      if(response.data.message === "PASSWORD Reset Successfully"){
            toast.success(response.data.message, {
              position:'top-right',
              autoClose: 1000,
              theme:"dark",
              transition: Bounce,
            });
          }else if (response.data.message == "User Not Found!"){
          toast.error(response.data.message , {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
            });
        }else {
            toast.error(response.data.message, {
            position: "top-right",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
          });
         
        
        }

      if (response.data.message === 'PASSWORD Reset Successfully') {
        setCurrentStep('success');
      }
    } catch (error) {
      toast.error('Failed to RESET Password!', {
            position: "top-center",
            autoClose: 1000,
            theme: "dark",
            transition: Bounce,
          });
    }finally{
      setLoading(false);
    }
  };

  return (
      <>
  <div style={{marginTop:'50px',marginLeft:'460px', width:'600px', padding:'40px', border:'0.5px solid white',borderRadius:'10px',backgroundColor:'black'}}>

      <ToastContainer />
      <button onClick={() => navigate('/login')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'transparent', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer', 
          fontSize: '40px',
          marginLeft:'-40px',
          marginTop:'-35px',
          marginBottom:'10px'
        }}
      >
        <FaArrowLeft style={{ marginRight: '8px' }} />
      
      </button>
      {loading && <div style={{ position: 'fixed',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',border: '4px solid #f3f3f3',borderTop: '4px solid #3498db',borderRadius: '50%',width: '40px',height: '40px',animation: 'spin 1s linear infinite'}}></div>}
      {currentStep ==='sendOtp'&&(
        <div>
          <h2 style={{textAlign:'center',fontWeight:'bold',marginBottom:'20px',marginTop:'-30px'}}>Reset Your Password</h2>
          <input type="gmail" placeholder="Enter your Email" value={gmail} onChange={(e) =>setGmail(e.target.value)} style={{width:'100%',marginBottom:'12px',border:'1px solid black',fontSize:'15px'}}/>
          <button onClick={handleSendOtp} style={{width:'100%',backgroundColor:'#0002ff',color:'white',borderRadius:'8px'}}>Send OTP</button>
        </div>
      )}
      {currentStep ==='verifyOtp'&&(
        <div>
          <h2 style={{textAlign:'center',fontWeight:'bold',marginBottom:'20px',marginTop:'-20px'}}>Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) =>setOtp(e.target.value)} style={{width:'100%',marginBottom:'12px',border:'1px solid black',fontSize:'15px'}}/>
          <button onClick={handleVerifyOtp} style={{width:'100%',backgroundColor:'#0002ff',color:'white',borderRadius:'8px'}}>Verify OTP</button>
        </div>
      )}
      {currentStep ==='resetPassword'&&(
        <div>
          <h2 style={{textAlign:'center',fontWeight:'bold',marginBottom:'20px',marginTop:'-20px'}}>Reset Password</h2>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) =>setNewPassword(e.target.value)} style={{width:'100%',marginBottom:'12px',border:'1px solid black',fontSize:'15px'}}/>
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) =>setConfirmPassword(e.target.value)} style={{width:'100%',marginBottom:'12px',border:'1px solid black',fontSize:'15px'}}/>
          <button onClick={handleResetPassword} style={{width:'100%',backgroundColor:'#228b22',color:'white',borderRadius:'8px'}}>Reset Password</button>
        </div>
      )}
      {currentStep ==='success'&&(
        <div>
          <h2 style={{textAlign:'center',fontWeight:'bold',marginBottom:'10px',marginTop:'-10px'}}>Password Reset Successfully!</h2>
        </div>
      )}
    </div>
    </>
  );
};

export default ForgotPassword;




