import express from 'express';
import signIn from './Controller/userSignInController.mjs';
import verify from './Controller/userOtpVerifyController.mjs';
import connectRedis from './config/redis.mjs';
import dotenv from 'dotenv'

dotenv.config()

connectRedis();

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('health ok');
})

//Routing
app.use('/sigin',signIn);
app.use('/verify',verify);

//Starting server
const PORT= process.env.PORT;
app.listen(PORT, () =>{
    console.log(`App is running on port : ${PORT}`);
})