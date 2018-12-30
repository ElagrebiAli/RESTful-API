var mongoose=require('mongoose')

mongoose.promise=global.promise
mongoose.connect(process.env.MONGODB_URI)
/*mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp') :process.env.MONGODB_URI"URL ta3 el production" */

module.export={mongoose}
