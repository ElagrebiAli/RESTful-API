const mongoose =require('mongoose')
const validator =require('validator')
const jwt=require('jsonwebtoken')
const _=require('lodash')
const bcrypt=require('bcryptjs')
const Schema=mongoose.Schema

var UserSchema= new Schema({
  email:{
    type:String,
    required:[true,"email is required"],
    trim:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid email'
    }
  },
  password:{
    type:String,
    require:[true,"password is required"],
    minlength:[6,"Ooh!Password must be at least contient 6 caracters"]
},
  tokens:[{
     access:{
       type:String,
       required:true
     },
     token:{
       type:String,
       required:true
     }
  }]
})


UserSchema.methods.generateToken=function(){
  var user=this
  var access='auth'
  var token=jwt.sign({_id:user._id,access},process.env.JWT_SECRET).toString()
  user.tokens.push({access,token})
  return user.save().then(()=>{
    return token
  })
}

UserSchema.pre('save',function(next){
  var user=this
  if(!user.isModified('password')) return next()
  bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash(user.password,salt,(err,hash)=>{
         user.password=hash
         next()
       })
  })

})

var User=mongoose.model('User',UserSchema)
mongoose.exports={User}
