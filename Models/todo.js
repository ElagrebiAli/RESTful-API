const mongoose =require('mongoose')
const Schema=mongoose.Schema
const _=require('lodash')

var TodoSchema=new Schema({
  text:{
    type:String,
    required:true,
    minlength:10,
    trim:true
  },
  completed:{
    type:Boolean,
    default:false
  },
  completedAt:{
    type:Date,
    default:null
  },
  publichedAt:{
    type:Date,
    default:Date.now()
  },
  _creator:{
    type:Schema.Types.ObjectId,
    required:true
  }
})
TodoSchema.methods.toJSON=function(){
  var todo=this
  var todoObject=todo.toObject()
  return _.pick(todoObject,['_id','_creator','text','publichedAt','completed','completedAt'])
}

var Todo=mongoose.model('Todo',TodoSchema)
module.exports={Todo}
