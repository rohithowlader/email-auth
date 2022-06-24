import Otp from "../models/otpModel.mjs";
import User from "../models/userSchema.mjs";
import newOTP from 'otp-generators';
import bcrypt from 'bcrypt';
import express from 'express';
import JWT from 'jsonwebtoken';
var verifyOtp= express.Router();

verifyOtp.post('/',async(req,res)=>{
    try{
    const otpHolder = await Otp.find({email:req.body.email});
    if(otpHolder.length===0) return res.status(400).send("You used an Expired OTP!");
    const rightOtpFind= otpHolder[otpHolder.length-1];
    const vaildUser= await  bcrypt.compare(req.body.otp,rightOtpFind.otp);
    if(rightOtpFind.email === req.body.email && vaildUser)
   {
        // const user = new User(_.pick(req.body,["email"]));
        // const token = user.generateJWT();
        // const result= await user.save();
        const token= JWT.sign(req.body.email, process.env.JWT_SECRET_KEY);
        const OTPDelete= await Otp.deleteMany({
            email:rightOtpFind.email
        })
        return res.status(200).send({
            message:"User Registration Succesfull!",
            token:token
            // data:result
        })
   } else {
    return res.status(400).send("your Otp was wrong");
   }
}
catch(e)
{
    console.log(e);
}
})

export default verifyOtp;