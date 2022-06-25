import express from 'express';
import Otp from "../models/otpModel.mjs";
import newOTP from 'otp-generators';
import bcrypt from 'bcrypt';
var signIn= express.Router();


signIn.post('/',async(req,res)=>{
    const OTP= newOTP.generate(6, { alphabets: true, upperCase: true, specialChar: false });
    const email= req.body.email;
    const otp=new Otp({email:email, otp:OTP});
    const salt = await bcrypt.genSalt(10);
    otp.otp=await bcrypt.hash(otp.otp,salt);
    const result = await otp.save();
    return res.send({email:req.body.email,otp:OTP});
    
})
export default signIn;