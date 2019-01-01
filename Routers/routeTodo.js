const express=require('express')
const routeTodo=express.Router()
const _=require('lodash')
const {ObjectID}=require('mongodb')
var {Todo}=require('../Models/todo')
var {authenticate}=require('../middleware/authenticate')


routeTodo.post('/',authenticate,(req,res)=>{
  var body =_.pick(req.body,['text'])
  var todo=new Todo({
    text:body.text,
    _creator:req.user._id
})
todo.save().then((doc)=>{
  res.status(400).send(doc)
}).catch((e)=>{
  res.status(400).send(e)
})

})

routeTodo.get('/todos',authenticate,(req,res)=>{
  Todo.find({
    _creator:req.user._id
  }).then((todos)=>{
    if(!todos){
      res.status(200).json({message:`You don't Have any Todo`})
    }
    res.send({todos})
  }).catch((err)=>{
    res.status(400).send()
  })
})

routeTodo.get('/todo/:id',authenticate,(req,res)=>{
  if(!ObjectID.isValid(req.params.id)){
    res.satuts(404).json({alert:'invalid ID'})
  }

  Todo.findOne({
    _id:req.params.id,
    _creator:req.user._id
  }).then((todo)=>{
    if(!todo){
      res.status(404).json({alert:'Not Found'})
    }
    res.status(200).send({todo})
  }).catch((e)=>{
    res.status(400).send()
  })

})

routeTodo.delete('/todo/:id',authenticate,(req,res)=>{
  if(!ObjectID.isValid(req.params.id)){
    res.status(404).json({alert:'invalid ID'})
  }
  Todo.findOneAndRemove({
    _id:req.params.id,
    _creator:req.user._id
  }).then((todo)=>{
    if(!todo){
      res.status(404).json({alert:'Not Found'})
    }
    res.status(200).send(todo)
  }).catch((err)=>{
    console.log(err)
    res.status(400).send({err})
  })
})


routeTodo.patch('/todo/:id',authenticate,(req,res)=>{
  var body=_.pick(req.body,['text','completed'])
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).json({alert:'invalid ID'})
  }
  if(body.completed){
    body.completedAt= Date.now()
  }
  Todo.findOneAndUpdate({_id:req.params.id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).json({alert:'Not found '})
    }
    res.send({todo})
  }).catch((e)=>{
    res.satuts(400).send()
  })
})



module.exports={routeTodo}
