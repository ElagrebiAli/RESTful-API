var mongoose=require('mongoose')
console.log(process.env.MONGODB_URI)
mongoose.promise=global.promise
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
/*mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp') :process.env.MONGODB_URI"URL ta3 el production" */

module.exports={mongoose}
