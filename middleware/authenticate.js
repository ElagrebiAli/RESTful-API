var {User}=require('../Models/user')

var authenticate=(req,res,next)=>{
  var token =req.header('x-auth')
  
  User.findByToken(token).then((user)=>{
    if(!user){
      res.status(400).json({alert:'user Not found'})
    }
    req.user=user
    req.token=token
    next()
  }).catch((e)=>{
    res.status(401).json({alert:'invalid Token'})
  })
}


module.exports={authenticate}
