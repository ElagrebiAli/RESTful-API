var mongoose=require('mongoose')
console.log(process.env.MONGODB_URI)
mongoose.promise=global.promise
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
/*mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp') */

module.exports={mongoose}
