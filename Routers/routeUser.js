
const express=require('express')
const routeUser=express.Router()
const _=require('lodash')

var {User}=require('../Models/user')

//POST /users

routeUser.post('/',(req,res)=>{
  var body=_.pick(req.body,['email','password'])
  var user=new User(body)
  user.save().then(()=>{
    return user.generateToken()
  }).then((token)=>{
    res.header('x-auth',token).send(user)
  }).catch((err)=>{
    if(err.errors){
      console.log(err)
        if(err.errors.email){
            res.status(400).json({message:err.errors.email.message})
        }
        if(err.errors.password){
          res.status(400).json({message:err.errors.password.message})
        }
    }else if(err.code===11000){
          res.status(400).json({message:'email already taken'})
    }
  })
})

module.exports={routeUser}
