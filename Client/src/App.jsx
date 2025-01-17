import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Forgotpassword from './components/Forgotpassword';
import Changepassword from './components/Changepassword';
import Protectedroute from './components/Protectedroute';
import Adminpnlx from './components/Adminpnlx';
import Adminroute from './components/Adminroute'
import Addrecipe from './components/Addrecipe';
import Allrecipe from './components/Allrecipe';
import Editrecipe from './components/Editrecipe';
import Viewrecipe from './components/Viewrecipe';
import Difficulty from './components/Difficulty';
import Category from './components/Category';
import Cuisine from './components/Cuisine';
import Logout from './components/Logout';
import Review from './components/Review';
import Editreview from './components/Editreview';
import { Allusers } from './components/Allusers';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Protectedroute><Profile /></Protectedroute>}></Route>
        <Route path="/change-password" element={<Changepassword/>} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/adminpnlx" element={<Adminroute><Adminpnlx /></Adminroute>} />
        <Route path="/addrecipe" element={<Addrecipe />} />
        <Route path="/allrecipe" element={<Allrecipe />} />
        <Route path="/edit/:id" element={<Editrecipe />} />
        <Route path="/view/:id" element={<Viewrecipe />} />
         <Route path="/difficulty" element={<Difficulty />} />
         <Route path="/cuisine" element={<Cuisine />} />
         <Route path="/category" element={<Category />} />
         <Route path="/logout" element={<Logout />} />
         <Route path="/review" element={<Review />} />
         <Route path="/editreview/:reviewId" element={<Editreview />} />
         <Route path="/allusers" element={<Allusers />} />
      </Routes>
   
    </Router>
  );
}

export default App;
