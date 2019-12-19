const router=require('express').Router()
const User=require("../model/User")
const Joi = require('@hapi/joi');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {registrationValidation,loginValidation}=require('../validation')


router.post('/register', async(req,res)=>{

const {error}=registrationValidation(req.body)
   if(error) return res.status(400).send(error.details[0].message)
  

   //HASH THE PASSWOORDS
   const salt=await bcrypt.genSalt(10)
   const hashedPassword=await bcrypt.hash(req.body.password,salt)


   //Check whether email already exists
   const emailExist=await User.findOne({email:req.body.email})
   if(emailExist) return res.status(400).send('Email already exists')

   //TO CREATE A NEW USER
  const user=new User({
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword
  })
  try {
      const savedUser=await user.save()
      res.send(savedUser)
  } catch (error) {
      res.status(400).send(error)
  }
})

router.post('/login',async (req,res)=>{

    const {error}=loginValidation(req.body)
if(error) res.status(400).send(error.details[0].message)
    //Check email exists

    const user=await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Email doesnt exist')

    //Check whether password is true

    const validPass=await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).send('Password is wrong')

//create and assign a token
const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
res.header('auth-token',token).send(token)

    res.send('Logged in successfully')
})

module.exports=router