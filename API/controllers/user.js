import {User} from '../Models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer, { createTransport } from 'nodemailer'

dotenv.config();
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const register = async (req,res)=>{
    const{first_name,last_name,gmail,password,city,pincode,address_line_1,address_line_2,country,state,phone} = req.body

    try {
        let user = await User.findOne({gmail})
        if(user) return res.json({message:"Gmail Already Exist, Try to Login"});

    const hashPass = await bcrypt.hash(password,10)
    
        user = await User.create({first_name,last_name,gmail,password : hashPass,city,pincode,address_line_1,address_line_2,country,state,phone})
        res.json({message:"User Registered Successfully..!",user})
    
    } catch (error) {
        res.json({message:error})
    }
}


export const login = async (req,res)=>{
    const{gmailOrPhone,password} = req.body

    try {
        const user = await User.findOne({$or : [{gmail: gmailOrPhone},{phone: gmailOrPhone}]});
        if(!user) {
          //   console.log('user not exist')
            return res.json({message: "User Not Exist"});
        }
      
    const match = await bcrypt.compare(password, user.password);
    
    
    if (!match) {
       // console.log('Invalid credentials');
        return res.json({ message: "Invalid Credentials" });
      }

     
    const token = jwt.sign({ userId: user._id }, "!@#$%^&*()", {
      expiresIn: '30d'
    });

        res.json({message:`Welcome ${user.first_name}`,token,user});
       //  console.log('loginn',token)

    } catch (error) {
        res.json({message: error.message});
    }
}

export const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password -__v');
      if (!user) {
        return res.json({ message: "User not found" });
      }
      res.json({message:"logged user details: ",user });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
  
  export const updateUserProfile = async (req, res) => {
    const { first_name, last_name, city, pincode, address_line_1, address_line_2, country, state, phone } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(req.user.userId,
        { first_name, last_name, city, pincode, address_line_1, address_line_2, country, state, phone },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.json({ message: error.message });
    }
  }


  export const changePassword = async(req,res) => {
    const {currentPassword, newPassword} = req.body;

    try {
      const user = await User.findById(req.user.userId);
      if(!user){
        return res.json({message:"User not found"});
      }

      const match = await bcrypt.compare(currentPassword,user.password);
      if(!match){
        return res.json({message:"Current password is incorrect"});
      }
      const hashNewpassword = await bcrypt.hash(newPassword,10);
      user.password = hashNewpassword;
      await user.save();

      res.json({message:"Password changed successfully"});
    } catch (error) {
      res.json({message: error.message});
    }
  };

  let otps = {};

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD
    }
  });
  

export const sendOtp = async (req,res) => {
  const{gmail} = req.body;
  try {
    const user = await User.findOne({ gmail });
    if(!user){
      return res.json({message:"User not found"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[gmail] = otp;


   const mailOptions = {
    from: EMAIL,
    to: gmail,
    subject: 'Password reset OTP',
    text: `HELLO ${user.first_name}, your OTP to Reset Password is ${otp}`
   };

   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('error sending otp:',error)
      return res.json({ message: error.message });
    } else {
      return res.json({ message: 'OTP Sent Successfully' });
    }
  });
  } catch (error) {
    res.json({message: error.message});
  }
};

export const verifyOtp = async (req, res) => {
  const { gmail, otp } = req.body;
  try {
    if (otps[gmail] === otp) {
        delete otps[gmail]; 
        res.json({ message: "OTP Verified Successfully" });
    } else {
        res.json({ message: "Invalid OTP!" });
    }

} catch (error) {
    res.json({ message: error.message });
}
};

export const resetPassword = async (req,res) => {
  const {gmail, newPassword} = req.body;
  try {
   const user = await User.findOne({ gmail });
   if(!user){
    return res.json({message:"User Not Found!"});
   }
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   user.password = hashedPassword;
   await user.save();

   res.json({message:"PASSWORD Reset Successfully"});
} catch (error) {
    res.json({ message: error.message });
}
};



// export const getUserProfile = async (req,res) => {
//     const id  = req.params.id
//     try {
//         const user = await User.findById(id).select('-password');
    
//         res.json({message:"user is logged in",user});
//     } catch (error) {
//         res.json({message:error.message})
//     }
// }

// export const updateUserProfile = async (req, res) => {
//     const id  = req.params.id
//     const updatedData = req.body;
  
//     try {
//      let user = await User.findById(id)
//      if (!user) return res.json ({message:"user not found"})
    
//     let data = await User.findByIdAndUpdate(id,updatedData,{new:true})
//     res.json({message:"updated data",data})

//     } catch (error) {
//       res.json({ message: error.message });
//     }
//   }
  



