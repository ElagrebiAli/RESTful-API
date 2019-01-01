
const express=require('express')
const routeUser=express.Router()
const _=require('lodash')

var {User}=require('../Models/user')
var {authenticate}=require('../middleware/authenticate')
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

        if(err.errors.email){
            res.status(400).json({message:err.errors.email.message})
        }else if(err.errors.password){
          res.status(400).json({message:err.errors.password.message})
        }
    }else if(err.code===11000){
          res.status(400).json({message:'email already taken'})
    }
  })
})

routeUser.post('/login',(req,res)=>{
  var body=_.pick(req.body,['email','password'])
  User.findByCredentials(body.email,body.password).then((user)=>{
      return user.generateToken().then((token)=>{
        res.header('x-auth',token).send(user)
      })
  }).catch((err)=>{
    res.status(400).json({alert:'Wrong email'})
  })
})

routeUser.delete('/logout',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).json({message:`See y ${req.user.email}`})
}).catch((err)=>{
  res.status(400).send()
})
})


module.exports={routeUser}
