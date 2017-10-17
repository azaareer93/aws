// var mongoose   = require('mongoose');
// var Schema     = mongoose.Schema;
// var validate   = require('mongoose-validator');
//  mongoose.Promise = global.Promise;
//
//  var Notifications = new Schema({
//     message:{
//       type:String,
//       required:true
//     },
//     username:{
//       type:String,
//       required:true,
//       lowercase: true
//     },
//     date:{
//       type:Date,
//       default:new Date().toJSON().split('T')[0]
//     },
//     read: {
//       type:Boolean,
//       default:false
//     },
//     time :{
//       type:String,
//       required:true
//     },
//     action: {
//       type:String,
//       required:true
//     }
// });
//
//
// module.exports=mongoose.model('Notifications',Notifications);
