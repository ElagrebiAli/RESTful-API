const jwt=require('jsonwebtoken')
const {ObjectID}=require('mongodb')


var {User}=require('../../Models/user')
var {Todo}=require('../../Models/todo')

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

const todos=[{
  _id:new ObjectID(),
  text:'First text',
  _creator:userOneId
},{
  _id:new ObjectID(),
  text:'Second text',
  _creator:userTwoId
  }]

const injectTodos=(done)=>{
  Todo.deleteMany({}).then(()=>{
     var todoOne=new Todo(todos[0]).save()
     var todoTwo=new Todo(todos[1]).save()
     return Promise.all([todoOne,todoTwo])
  }).then(()=>done())
}


const injectUsers=()=>{
  User.deleteMany({}).then(()=>{
    var userOne=new User(users[0]).save()
    var userTwo=new User(users[1]).save()
    return Promise.all([userOne,userTwo])
  })
}

module.exports={users,injectUsers,todos,injectTodos}
