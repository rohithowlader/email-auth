import express from 'express';
import connectDB from './config/db.mjs';
import sendEmailRouter from './routes/sendEmail.mjs'

connectDB();

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('index');
})


//Routing
app.use('/emailSend', sendEmailRouter);


//Starting server
const PORT= process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`App is running on port : ${PORT}`);
})