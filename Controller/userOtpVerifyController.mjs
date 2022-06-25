import express from 'express';
import JWT from 'jsonwebtoken';
import { getClient } from '../config/redis.mjs';
var verifyOtp = express.Router();

verifyOtp.post('/', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const client = await getClient();

        // Check if user is blocked
        let blockKey = `${email}_block`;
        const block = await client.get(blockKey);
        if (block) {
            res.status(400).json({
                message: `You are blocked for 1 hour`
            });
            return
        }

        // Check OTP
        let otpKey = `${email}_OTP`;
        const otpFromRedis = await client.get(otpKey);

        if (otpFromRedis === otp) {
            const token = JWT.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
            // Delete attempts from redis
            let attemptsKey = `${email}_attempts`;
            client.del(attemptsKey);
            client.del(otpKey);

            res.status(200).json({
                message: `OTP verified`,
                token
            });
        } else {
            // Block if 5 times wrong otp
            let wrongOtp = 1
            let wrongOtpKey = `${email}_attempts`;
            let wrongCount = await client.get(wrongOtpKey);
            if (wrongCount) {
                wrongOtp = parseInt(wrongCount) + 1;
            }
            if (wrongOtp === 5) {
                let blockKey = `${email}_block`;
                client.set(blockKey, "1", { EX: 60 * 60 });
            }
            client.set(wrongOtpKey, wrongOtp);
            res.status(400).json({
                message: `OTP is invalid`
            });
        }
    } catch (error) {
        res.status(400).json({
            message: `Something went wrong`
        });
    }
})

export default verifyOtp;