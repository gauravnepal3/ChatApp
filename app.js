const express = require('express')
const mongoose=require('mongoose')
const authRoute=require('./routes/authRouter/authRouter')
const cookieParser=require("cookie-parser")



const app=express();

app.use(express.json())


//view engine

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.render('home');
})

//connecting to mongodb

const dbURL='mongodb+srv://summerClass:chatapp@summerclass.ierg5cj.mongodb.net/summerClass'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(8000,(req,res)=>{
    console.log("Server is running")
  }))
  .catch((err) => console.log(err));



// routes
app.use(authRoute)
