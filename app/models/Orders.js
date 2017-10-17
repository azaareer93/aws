// var mongoose   = require('mongoose');
// var Schema     = mongoose.Schema;
// var validate   = require('mongoose-validator');
//  mongoose.Promise = global.Promise;
//
//  var OrderSchema = new Schema({
//     orderedBy:{
//       type:String,
//       lowercase:true,
//       required:true
//     },
//     recipientId:{
//       type:String,
//       required:true
//     },
//     company:{
//       type:String
//     },
//     orderItems:[{
//         itemName:{
//           type:String,
//           lowercase:true,
//           required:true
//         },
//         itemPrice:{
//           type:Number,
//           required:true
//         },
//         quantity:{
//           type:Number,
//           required:true
//         },
//         total:{
//           type:Number,
//           required:true
//         },
//         purchased:{
//           type:Boolean,
//           default:false
//         },
//         restaurant : {
//           type:String,
//           lowercase:true,
//           required:true
//         },
//         restOwner : {
//           type:String,
//           required : true
//         },
//         status : {
//           type : String,
//           default : 'pending'
//         }
//     }],
//     date:{
//       type:Date,
//       required:true,
//       default:new Date().toJSON().split('T')[0]
//     },
//     time : {
//       type:String,
//       required : true
//     },
//     purchased :{
//       type:Boolean,
//       default:false
//     },
//     checkedOut :{
//       type:Boolean,
//       default:false
//     }
// });
//
//
// module.exports=mongoose.model('Orders',OrderSchema);
