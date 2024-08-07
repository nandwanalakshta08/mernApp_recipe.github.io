import {User} from '../Models/User.js';
import jwt from 'jsonwebtoken'

export const authenticate = async (req,res,next)=>{
    const token = req.header("Authorization").replace('Bearer ', '');

    if (!token) {
      return res.json({ message: "No token provided" });
    }

    try{
        
      const decoded = jwt.verify(token, "!@#$%^&*()");
      req.user = decoded;
      next();

    }catch(error){
      res.json({message:error})
    }
}
export default authenticate;