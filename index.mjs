import express from 'express';
import connectDB from './config/db.mjs';
import sendEmailRouter from './service/sendEmail.mjs';
import signIn from './Controller/userSignInController.mjs';
import verify from './Controller/userOtpVerifyController.mjs';

connectDB();

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('index');
})


//Routing
app.use('/emailSend', sendEmailRouter);
app.use('/sigin',signIn);
app.use('/verify',verify);

//Starting server
const PORT= process.env.PORT ;
app.listen(PORT, () =>{
    console.log(`App is running on port : ${PORT}`);
})