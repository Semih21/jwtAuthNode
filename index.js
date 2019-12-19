const express=require('express')

const mongoose = require('mongoose');
const dotenv=require('dotenv') //require('dotenv').config()
dotenv.config()

//import Routes
const authRoute=require('./routes/auth')
const postRoute=require('./routes/posts')
//Middleware
const app=express()
app.use(express.json())

//Connect to the Database
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true},()=>{
    console.log('Connected to DB')
})

app.use('/api/user',authRoute)
app.use('/api/posts',postRoute)

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})