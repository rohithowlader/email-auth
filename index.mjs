import express from 'express';


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('index');
})


//Routing


//Starting server
const PORT= process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`App is running on port : ${PORT}`);
})