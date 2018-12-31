const jwt=require('jsonwebtoken')
const {ObjectID}=require('mongodb')

const {User}=require('../../Models/user')

const userOneId=new ObjectID()
const userTwoId=new ObjectID()
console.log(process.env.JWT_SECRET)
const users=[{
  _id:userOneId,
  email:'elagrebi@gmail.com',
  password:'elagrebipass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
},{
_id:userTwoId,
email:'username@gmail.com',
password:'usernamepass',
tokens:[{
  access:'auth',
  token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
}]
}]

const injectUsers=()=>{
  User.deleteMany({}).then(()=>{
    var userOne=new User(users[0]).save()
    var userTwo=new User(users[1]).save()
    return Promise.all([userOne,userTwo])
  })
}

module.exports={users,injectUsers}
