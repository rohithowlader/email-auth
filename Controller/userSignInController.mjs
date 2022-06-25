import express from 'express';
import newOTP from 'otp-generators';
import { getClient } from '../config/redis.mjs';
import sendOTP from '../service/sendEmail.mjs';
var signIn = express.Router();

signIn.post('/', async (req, res) => {

    // Check rate limit
    const client = await getClient();
    let generateKey = `${req.body.email}_generateOTP`;
    const isPresent = await client.get(generateKey)
    if (isPresent) {
        let t = await client.EXPIRETIME(generateKey);
        res.status(400).json({
            message: `Please wait ${t - Math.floor(Date.now()/1000)} seconds before generating another OTP`
        });
        return;
    }

    // Generate OTP
    const OTP = newOTP.generate(6, { alphabets: true, upperCase: true, specialChar: false });

    // Send mail
    const email = req.body.email;
    let message = await sendOTP(email, OTP);
    if (message && message.message) {
        res.status(400).json(message);
        return;
    } else {
        // Save OTP in redis
        let otpKey = `${email}_OTP`;
        client.set(otpKey, OTP, {EX : 300});
        res.status(200).json({
            message: `OTP has been sent to ${email}`
        });

        client.set(generateKey, "1", {EX : 60});

    }
})

export default signIn;