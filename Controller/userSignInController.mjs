import express from 'express';
import newOTP from 'otp-generators';
import { getClient } from '../config/redis.mjs';
import sendOTP from '../service/sendEmail.mjs';
var signIn = express.Router();

signIn.post('/', async (req, res) => {

    try {
        // Check if user is blocked
        const client = await getClient();
        const email = req.body.email;
        let blockKey = `${email}_block`;
        const block = await client.get(blockKey);
        if (block) {
            res.status(400).json({
                message: `You are blocked for 1 hour`
            });
            return
        }

        // Check rate limit
        let generateKey = `${req.body.email}_generateOTP`;
        const isPresent = await client.get(generateKey)
        if (isPresent) {
            let ttl = await client.ttl(generateKey);
            res.status(400).json({
                message: `Please wait ${ttl} seconds before generating another OTP`
            });
            return;
        }

        // Generate OTP
        const OTP = newOTP.generate(6, { alphabets: true, upperCase: true, specialChar: false });

        // Send mail
        let message = await sendOTP(email, OTP);
        if (message && message.message) {
            res.status(400).json(message);
            return;
        } else {
            // Save OTP in redis
            let otpKey = `${email}_OTP`;
            [a, b] = client.multi()
                .set(otpKey, OTP, { EX: 60 * 5 })
                .set(generateKey, "1", { EX: 60 * 5 }).exec();
            res.status(200).json({
                message: `OTP has been sent to ${email}`
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: `Something went wrong`
        });
    }
})

export default signIn;