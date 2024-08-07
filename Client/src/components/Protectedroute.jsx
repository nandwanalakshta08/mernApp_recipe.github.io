import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Protectedroute = ({ children }) => {

    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            // navigate('/login');
            toast.error("Login First to visit", {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            // navigate('/login');

            setTimeout(() => {
                navigate('/login');
            }, 1000); 
        }
    }, [authToken, navigate]);

    if (!authToken) {
        return <ToastContainer />;
    }

  return children;
};

export default Protectedroute;
