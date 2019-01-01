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
UserSchema.methods.toJSON=function(){
  var user=this
  var userObject=user.toObject()
  return _.pick(userObject,['_id','email'])
}

UserSchema.methods.generateToken=function(){
  var user=this
  var access='auth'
  var token=jwt.sign({_id:user._id},process.env.JWT_SECRET)/*lina fama tabdila*/
  user.tokens.push({access,token})
  return user.save().then(()=>{
    return token
  })
}

UserSchema.methods.removeToken=function(token){
  var user=this
  return user.updateOne({
    $pull:{
      tokens:{token}
    }
  })

}

UserSchema.statics.findByToken=function(token){
  var User=this
 try{
   var decoded=jwt.verify(token,process.env.JWT_SECRET)
 }catch(e){
   return Promise.reject()
 }
 return User.findOne({
   '_id':decoded._id,
   'tokens.token':token,
   'tokens.access':'auth'
 })
}


UserSchema.statics.findByCredentials= function(email,password){
  var User=this
  return User.findOne({email}).then((user)=>{

    if(!user){
      return Promise.reject()
    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,res)=>{

        if(res){
          resolve(user)
        }else{
            reject()
        }
      })
    })
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
module.exports={User}
