import mongoose from 'mongoose';
const { Schema } = mongoose;


const otpSchema = new Schema({
    email: {
        type: String,
        requied: true,
      },
      otp:{
        type: String,
        requied: true,
      },
      wronginput:{
        type: Number,
        requied: true,
      }

},{createdAt:{type:Date,default:Date.now,index:{expires:300}}
},{timestamps:true});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;