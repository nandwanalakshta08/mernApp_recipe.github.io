import express from "express";
import { register, login, updateUserProfile, getUserProfile, changePassword, verifyOtp, resetPassword, sendOtp} from '../controllers/user.js'
import authenticate from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/adminAuth.js";
const router = express.Router();

router.post('/register', register);

router.post('/login',login);

router.get('/profile',authenticate,getUserProfile)

router.put('/profile',authenticate, updateUserProfile)

router.put('/change-password',authenticate,changePassword)

router.post('/sendotp', sendOtp)

router.post('/verifyotp',verifyOtp)

router.post('/resetpassword',resetPassword)

router.get('/adminpnlx', isAdmin, (req, res) => {
    res.json({ message: "Welcome to the admin panel" });
  });
export default router


