var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var validate   = require('mongoose-validator');
var Promise          = require('mpromise');
mongoose.Promise = global.Promise;

var LogsSchema = new Schema({
  UserName:{
    type:String,
    lowercase:true,
  },
  Action:{
    type:String,
  },
  Date:{
      type:Date,
      default:new Date().toJSON()
  },
  Note:{
    type:String,
    default:"--"
  }
  });


module.exports=mongoose.model('Logs',LogsSchema);
