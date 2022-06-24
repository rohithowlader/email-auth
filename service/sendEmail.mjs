import express from 'express';
var sendEmailRouter = express.Router();
import nodemailer from 'nodemailer';

const checkEmail = async (email) => {
    const expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regex = new RegExp(expression);
    if (email.match(regex)) {
        return true
    } else {
        return false
    }
}

sendEmailRouter.post('/', async (req, res) => {
    try {
        const isValidSender = await checkEmail(req.body.email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        });

        const mailConfigurations = {
            from:  process.env.EMAIL,
            to: `${req.body.email}`,
            subject: `OTP for login`,
            text: `OTP for login is XXXXXX`
        };
        if ( !isValidSender) {
            return res.status(500).send("Wrong Email input");
        }
        else {
            transporter.sendMail(mailConfigurations, function (error, info) {
                if (error) throw Error(error);
                console.log('Email Sent Successfully');
            });
            // return res.render('emailSent',);
        }
    }
    catch (e) {
        console.log(e);
    }
})

export default sendEmailRouter;