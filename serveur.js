require('./config/config')

const express =require('express')
const bodyparser=require('body-parser')


var {mongoose}=require('./db/mongoose')
var {routeUser}=require('./Routers/routeUser')


var app=express()
const port=process.env.port
console.log(port)

app.use(bodyparser.json())

app.use('/users',routeUser)


app.listen(port,()=>{
  console.log(`Started up at port ${port}`)
})

module.exports={app}
