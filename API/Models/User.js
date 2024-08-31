import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: 
     { type: String,
      require: true, },
    last_name:
     { type: String, 
       require: true, },
    gmail:
     { type: String,
       require: true, },
    password:
     { type: String, 
       require: true, },
    city:
     { type: String, 
       require: true, },
    pincode:
     { type: String,
       require: true, },
    address_line_1:
     { type: String,
       require: true, },
    address_line_2:
     { type: String,
       require: true, },
    country:
     { type: String,
       require: true, },
    state:
     { type: String,
       require: true, },
    phone:
     { type: String,
       require: true },
   its_admin:
    {
      type: Number,
      default: 1,
      enum: [0,1],      //0=admin and 1=user
      // require: true
    }
});

export const User = mongoose.model("User", userSchema);