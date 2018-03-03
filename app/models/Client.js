var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var validate   = require('mongoose-validator');
var Promise          = require('mpromise');
mongoose.Promise = global.Promise;

var ClientSchema = new Schema({
  Name:{
    type:String,
    required:true,
    default:null
  },
  Address:{
    type:String,
    default:null
  },
  Tel1:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    default:null
  },
  Tel2:{
    type:String,
    lowercase:true,
    unique:true,
    default:null
  },
  Fax:{
    type:String,
    default:null
  },
  Email:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    default:null
  }
  });


module.exports=mongoose.model('Client',ClientSchema);
