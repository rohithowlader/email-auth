import nodemailer from 'nodemailer';

let transporter

const checkEmail = async (email) => {
    const expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regex = new RegExp(expression);
    if (email.match(regex)) {
        return true
    } else {
        return false
    }
}

const getTransporter = async () => {
    //email authentication
    transporter = nodemailer.createTransport({
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

    return transporter;
}

const sendEmail = async (email, subject, text) => {
    const transporter = await getTransporter();
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };
    //sending email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const SendOTP = async (email, otp) => {
    // Check email
    const isEmailValid = await checkEmail(email);
    if (!isEmailValid) {
        return {
            message: 'Invalid email'
        }
    }

    const subject = 'OTP for Sign In';
    const text = `Your OTP is ${otp}`;
    await sendEmail(email, subject, text);
}

export default SendOTP;