var path             = require('path');
var User       = require("../models/User");
var Notifications = require("../models/Notifications");
var Orders = require("../models/Orders");
var config       = require("../config");
var roles       = require("../roles");
var jwt        = require('jsonwebtoken');
var util       = require('util');
var secret     = 'whatever';
var mongoose = require('mongoose');
var date = new Date().toJSON().split('T')[0];
// var soap = require('soap');
//var io = require('socket.io').listen(3001);

// io.on('connection',function(socket) {
//   console.log("new Connection: ",socket.conn.id)
//     this.send = function(evt,data) {
//       console.log(evt,data)
//       socket.emit(evt, data);
//     }
// });


module.exports = function(router) {
  //http://localhost:3000/api/orders/
  //user Registration Route
  router.get('/orders/',function(req,res){
        Orders.find({}).then(function (orders) {
              res.json({success:true, orders:orders});
        }).catch(err=>{
          res.json({success:true,message:'erro with getting orders'});
        });
      });

  router.post('/orders/',function(req,res){
        var order = new Orders(req.body);
        order.save().then(function (err,order) {
          if (err) {
            res.json({success:false, message:err});
          }else {
            res.json({success:true, order:order, message:"order was saved"})
          }

        })
    });
//
//   router.post('/checkuser',function(req,res){
//     var userToCheck={
//       UserName:req.query.UserName,
//       Email:req.query.Email
//     };
//
//        User.findOne({$or:[{'UserName':userToCheck.UserName},{'Email':userToCheck.Email}]}).then(function(doc){
//          var  message="userName and E-mail are available";
//          var flag=true;
//          if(doc){
//           flag=false;
//           message="userName or E-mail are already taken";
//          }
//
//          res.json({success:flag, message:message});
//
//        }).catch(function (err) {
//
//        });
//
//   });
//
//
//   //user Login Route
//   // http://localhost:3000/api/authenticate
//
//   router.post('/authenticate',function(req,res){
//
//     //here th check our local costmers
//      var localCostmerStatus=false;
//
//      User.findOne({UserName:req.body.UserName}).then(function(user){
//
//        flage=false;
//        message="Invalid username";
//        token = {};
//
//      if(user){
//        if (req.body.Password) {
//            var ValidPassword = user.comparePassword(req.body.Password);
//            if(ValidPassword){
//              var token = jwt.sign({UserName:user.UserName, Email:user.Email, Permission:user.Permission}, secret, { expiresIn: '24h' });
//                 localCostmerStatus =true;
//                 flage=true;
//                 message="user authenticated";
//                 userNameAuthenticated = user.UserName ;
//                res.json({success:flage, message:message, token:token});
//              }else {
//                flage=false;
//                message="invalid password";
//                 res.json({success:flage, message:message});
//              }
//            }else {
//              flage=false;
//              message="Password was not provided";
//               res.json({success:flage, message:message});
//            }
//          }else {
//            if(!localCostmerStatus){
//                    //here to check the asal users
//                    var url = 'http://172.22.1.26/orgstructure/UsersService.asmx?WSDL';
//                    var args = {userName: req.body.UserName , password:req.body.Password };
//
//                    soap.createClient(url, function(err, client) {
//
//                             // console.log(client);
//
//                          client.AuthinticationStatus(args, function(err, result){
//
//                            if(result.AuthinticationStatusResult ){
//                             //  console.log(args.userName);
//                              var token = jwt.sign({UserName:args.userName.toLowerCase(), Permission:'User'}, secret, { expiresIn: '24h' });
//                              flage=true;
//                              message="user authenticated";
//                              res.json({success:flage, message:message, token:token });
//
//                            }
//                            else{
//                              flage=false;
//                              message="user or password is not valid";
//                                res.json({success:flage, message:message});
//                            }
//                        });
//                    });
//
//            }
//          }
//      });
//
//
//
//
//   });
//
// //verfiy token
// router.use(function (req,res,next) {
// var token = req.body.token || req.body.query || req.headers['x-access-token'];
//     if (token) {
//         jwt.verify(token,secret,function (err,decoded) {
//             if(err){
//                 res.json({success:false, message:"invalid or expired token"});
//             } else {
//               req.decoded = decoded;
//
//               next();
//             }
//         });
//     } else {
//       res.json({success:false, message:"No token provided"});
//     }
// });
//
// //current user route
//   router.post('/me',function (req,res) {
//     res.send(req.decoded);
//   });
//
//   router.get('/notifications',function (req,res) {
//     // Notifications.find({username: req.decoded.UserName, read:false},{"sort" : [['time', 'desc']]},function(err,doc) {
//     //   if(err) {
//     //     res.json({succes:false,message:'Error Getting Notifications'});
//     //   }else {
//     //     res.json({success:true,notifications:doc});
//     //   }
//     // });
//     Notifications.find({username: req.decoded.UserName, read:false}) // query
//     .sort('-time')  // DESC!
//     .exec(function(err,doc) {
//         if(err) {
//           res.json({succes:false,message:'Error Getting Notifications'});
//         }else {
//           res.json({success:true,notifications:doc});
//         }
//     }
//     );
//   });
//
//   router.post('/mark-readable',function (req,res) {
//
//      Notifications.findOneAndUpdate({_id:req.body.id },{$set:{read:true}},function(err, doc){
//        if(err){
//            res.json({success:false, message:err.errmsg});
//        }else {
//            res.json({success:true, message:"notification marked as readble "});
//        }
//      });
//
//   });
//
//
//   router.get('/renewToken/:UserName',function (req,res) {
//     User.findOne({UserName:req.params.UserName}).select().exec(function (err,user) {
//       if(err) throw err;
//       if(!user){
//         res.json({success:false, message:"no user found to renew session"})
//       }else {
//         var newToken = jwt.sign({UserName:user.UserName, Email:user.Email, Permission:user.Permission}, secret, { expiresIn: '24h' });
//         res.json({success:true, 'token':newToken});
//       }
//
//     });
//   });
//
//   router.get('/permission',function (req,res) {
//
//       User.findOne({UserName:req.decoded.UserName},function (err,user) {
//         if(err) throw err;
//         if(!user){
//
//           res.json({success:false, message:"no user found"});
//         }else{
//           res.json({success:true, permission:user.Permission ,authorized:req.authorized});
//         }
//       });
//   });
//
//   router.get('/management',userRoles,function (req,res) {
//     console.log("req.authorized",req.authorized);
//     User.findOne({UserName:req.decoded.UserName},function (err,mainUser){
//        if(err) throw err;
//        if(!mainUser){
//              res.json({success:false, message:"no user found"});
//         }else{
//           if(mainUser.Permission){
//              User.find({}).then(function (users) {
//                 res.json({success:true, users:users , permission:mainUser.Permission , authorized:req.authorized});
//              },function(err) {
//                  res.json({success:false, message:" No user found!"});
//              });
//           }else {
//             res.json({success:false, message:"Insufficient permission"});
//           }
//
//         }
//     });
//
//
//
//   });
// //to ban/unban users
//   router.put('/management/toToggleBan',function (req,res) {
//     var toToggleBan=req.query.userName;
//     var Status=req.query.Approved;
//
//                if(req.decoded.Permission === 'Admin'){
//                 User.findOneAndUpdate({UserName:toToggleBan},{$set:{Approved:!(Status === "true")}}).then(function (user) {
//                     res.json({success:true, message:""+user.UserName+" status was changed"});
//                 }).catch(function (err) {
//                     console.log(err);
//                 });
//               }
//
//   });
// // to block/unblock Restaurants
//   router.put('/management/toToggleBlock',function (req,res) {
//     var toToggleBan=req.query.RestId;
//     var Status=req.query.Availability;
//
//               if(req.decoded.Permission == 'Admin'){
//                 Restaurant.findOneAndUpdate({_id:toToggleBan},{$set:{RestAvailable:!(Status === "true")}}).then(function (rest) {
//                     res.json({success:true, message:""+rest.RestName+" approval was "+ Status +" and changed to "+ !rest.RestAvailable});
//                 }).catch(function (err) {
//                     console.log(err);
//                 });
//               }
//
//   });
//
//
// router.post('/saveRest', function (req, res) {
//   config.upload(req, res, function (err) {
//      if (err) {
//         if (err.code ==='filetype') {
//           res.json({success:false, message:"only image files are Accepted"});
//         } else {
//           res.json({success:false, message:"file was not uploaded"});
//         }
//
//      }else{
//       var  Rest = new  Restaurant();
//       console.log(req.file);
//         if(req.file){
//            Rest.RestImg=req.file.filename;
//         }else {
//           Rest.RestImg = "default.jpg";
//         }
//         console.log( Rest.RestImg);
//
//         Rest.RestName            =req.body.RestName;
//         Rest.RestLocation        =req.body.RestLocation;
//         Rest.RestOwner           =req.decoded.UserName;
//         Rest.RestDescription     =req.body.RestDescription;
//         Rest.RestPhone           =req.body.RestPhone;
//         Rest.RestAvailable       =req.body.RestAvailable;
//         Rest.AvailableToCart       =req.body.AvailableToCart;
//         Rest.save(function(err){
//           if(err){
//             res.json({success:false, err:err});
//           }else {
//             res.json({success:true, message:"Restaurant successfully created"});
//           }
//         });
//
//        }
//    });
// });
// router.delete('/delete-order-item',function(req,res) {
//   Orders.findOneAndUpdate(
//     {_id:req.query._id},
//     { $pull: { orderItems: { _id: req.query.orderItemId } } },function(err,doc) {
//       if(err) {
//         res.json({success:false, message:err});
//       }else {
//         if(doc.orderItems.length <= 1) {
//           Orders.remove(
//             {"_id": new mongoose.Types.ObjectId(doc._id)},
//             function(err,doc) {
//               if(err)
//                 console.log(err);
//             }
//           );
//         }
//         //send notification to socket with message item deleted
//         notification = new Notifications();
//         notification.message = "an item was deleted from order";
//         notification.username = req.query.restaurantOwner;
//         notification.action = "/restaurant-recipient";
//         notification.time = new Date().toLocaleTimeString();
//         notification.save();
//         io.send('notification',"ORDER-ITEM-DELETED");
//         res.json({success:true, message:"Item Was Deleted"});
//       }
//     }
//   );
// });
// router.post('/getMyRest',userRoles,function (req,res) {
//
//   Restaurant.find({RestOwner:req.decoded.UserName},function(err,myRest) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//         res.json({success:true, myRest:myRest, authorized:true});
//         }
//   });
//
//
//
//
// });
//
// router.get('/getAllRests',userRoles,function (req,res) {
//   var query = {};
//   if(req.decoded.Permission !== "Admin")
//     query= {RestAvailable:true};
//     Restaurant.find(query,function (err,Rests) {
//     if(err){
//       res.json({success:false, message:err.errmsg});
//     }else {
//       res.json({success:true, Rests:Rests});
//     }
//   });
// });
//
//
//
//
// router.put('/updateRest/',function (req,res) {
//   config.upload(req, res, function (err) {
//      if (err) {
//         if (err.code ==='filetype') {
//           res.json({success:false, message:"only image files are Accepted"});
//         } else {
//           res.json({success:false, message:"file was not uploaded"});
//         }
//
//      }else{
//        console.log(req.body);
//        var   id = req.body._id;
//        var   RestName=req.body. RestName;
//        var   RestLocation=req.body.RestLocation;
//        var   RestAvailable=req.body.RestAvailable;
//        var   RestDescription=req.body.RestDescription;
//        var   RestPhone=req.body.RestPhone;
//        var   AvailableToCart=req.body.AvailableToCart;
//
//        if(req.file){
//          var RestImg=req.file.filename;
//        }else {
//          var RestImg = req.body.RestImg[0];
//        }
//    Restaurant.findOneAndUpdate({_id:id},{$set:{RestName:RestName, RestLocation:RestLocation, RestAvailable:RestAvailable,RestDescription:RestDescription,RestImg:RestImg,RestPhone:RestPhone,AvailableToCart:AvailableToCart}}).then(function(user) {
//     res.json({success:true , message:"Restaurant updates successfuly"});
//    }).catch(function (err) {
//      res.json({success:false , err:err});
//    });
// }
// });
// });
//
// router.post('/pay-order-restaurant',function (req,res) {
//   console.log(req.body);
//   Orders.find(
//     {
//       'orderItems.restaurant': req.body.restaurant ,
//       checkedOut : true
//     },
//     function(err,doc) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//       for(var j=0;j<doc.length;j++) {
//         for(var i=0;i<doc[j].orderItems.length;i++) {
//           if(doc[j].orderItems[i].status=="accepted" && doc[j].orderItems[i].restaurant==req.body.restaurant) {
//             doc[j].orderItems[i].purchased = true;
//           }
//         }
//         doc[j].save();
//       }
//       // send notification to socket with message order is paid
//       notification = new Notifications();
//       notification.message = "an Order Was Paid";
//       notification.username = req.body.restOwner;
//       notification.action = '/restaurant-recipient';
//       notification.time = new Date().toLocaleTimeString();
//       notification.save();
//       io.send('notification',"ORDER-WAS-PAID");
//       res.json({success:true, message:"ORDER IS PAID" ,orders:doc});
//     }
//   })});
//
// router.post('/edit-rejected-item/',function(req,res) {
//   var itemToUpdate = req.body.newItem;
//   var oldId = req.body._id;
//   console.log("Z3roor: " , itemToUpdate)
//   Orders.update(
//     {"orderItems._id": oldId},
//     {
//       "$set":
//         {
//           "orderItems.$._id" : itemToUpdate._id,
//           "orderItems.$.total": itemToUpdate.total,
//           "orderItems.$.itemName": itemToUpdate.ItemName,
//           "orderItems.$.itemPrice" : itemToUpdate.ItemPrice,
//           "orderItems.$.quantity" : itemToUpdate.quantity,
//           "orderItems.$.status" : 'pending',
//           "orderItems.$.restaurant" : itemToUpdate.RestName,
//           "orderItems.$.restOwner" : itemToUpdate.RestOwner
//
//         }
//     },function(err,doc) {
//       if(err) {
//         res.json({success:false, message:err.errmsg});
//       }else {
//         //send notification to socket with message user has edited his item
//         notification = new Notifications();
//         notification.message = "an Order Was Updated";
//         notification.username = itemToUpdate.RestOwner;
//         notification.action = '/restaurant-recipient';
//         notification.time = new Date().toLocaleTimeString();
//         console.log(notification);
//         notification.save();
//         io.send('notification',"ORDER-ITEM-CHANGED");
//         res.json({success:true, message:"ORDER was updated" ,doc:doc});
//       }
//     }
//   );
// });
//
// router.post('/delete-item',function(req,res) {
//   var date = new Date().toJSON().split('T')[0];
//   Orders.findOneAndUpdate(
//     {
//       orderedBy : req.decoded.UserName,
//       date:date
//     },
//     { $pull: { orderItems: { _id: req.body._id} } },
//     function(err,doc) {
//       if(err)
//         res.json({success:false, message:err.errmsg});
//       else{
//         if(doc.orderItems.length <= 1) {
//           var orderedBy = doc.orderedBy;
//           var restOwner = doc.orderItems[0].restOwner;
//           Orders.remove(
//             {"_id": new mongoose.Types.ObjectId(doc._id)},
//             function(err,doc) {
//               if(err) {
//                 res.json({success:false, message:err.errmsg});
//               }else {
//                 console.log("ORDER DELETED" , doc);
//                 //send notification to restaurant that an order was deleted
//                 notification = new Notifications();
//                 notification.message = orderedBy + " has deleted his order";
//                 notification.username = restOwner;
//                 notification.action = '/restaurant-recipient';
//                 notification.time = new Date().toLocaleTimeString();
//                 notification.save();
//               }
//             }
//           );
//         }else {
//           console.log("ITEM DELETED" , doc);
//           //send notification to restaurant that an item was deleted from order
//           var item;
//           for(var i=0;i<doc.orderItems.length;i++) {
//             if(doc.orderItems[i]._id == req.body._id) {
//               item = doc.orderItems[i];
//             }
//           }
//           notification = new Notifications();
//           notification.message = doc.orderedBy + " has deleted an order item";
//           notification.username = item.restOwner;
//           notification.action = '/restaurant-recipient';
//           notification.time = new Date().toLocaleTimeString();
//           notification.save();
//         }
//         io.send('notification',"ORDER-ITEM-DELETED");
//         res.json({success:true, message:"Item Was Deleted" ,doc:doc});
//       }
//     }
//   );
// });
//
// router.post('/pay-order-user',function (req,res) {
//   Orders.findOneAndUpdate({orderedBy:req.body.username},{$set:{purchased:true}},function(err,doc) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//       notification = new Notifications();
//       notification.message = "Your Order Has Been Paid";
//       notification.username = req.body.username;
//       notification.action = '/my-orders';
//       notification.time = new Date().toLocaleTimeString();
//       notification.save();
//       io.send('notification',"ORDER-ITEM-PAID");
//       res.json({success:true, message:"ORDER IS PAID" ,order:doc});
//     }
//   });
// });
//
// router.get('/all-orders-restaurants/',userRoles,function(req,res) {
//   var date = new Date().toJSON().split('T')[0];
//   Orders.aggregate(
//     [
//      { $unwind : "$orderItems" },
//      { $match : {date:new Date(date),"orderItems.purchased":false,checkedOut:true,"orderItems.status":'accepted'} },
//      {
//         $group : {
//           _id :"$orderItems.restaurant",
//           order: { "$push": "$$ROOT"},
//           count: { $sum : 1 },
//           total:{$sum:"$orderItems.total"}
//         }
//       }
//    ],
//    function(err,doc) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//         res.json({success:true, orders:doc,date:date,authorized:true});
//     }
//   })
// });
//
// router.get('/all-items/',function(req,res) {
//   Restaurant.aggregate([
//     { $unwind : "$Items" },
//      {
//         $group : {
//           _id :"$RestName",
//           items: { "$push": "$Items"},
//           RestOwner: { "$push": "$RestOwner"},
//           RestName: { "$push": "$RestName"}
//         }
//       }
//   ],function(err,doc) {
//     if(err) {
//       res.json({success:false, message:err.errmsg});
//     }
//     else {
//       res.json({success:true, items:doc});
//     }
//   })
// });
// router.get('/all-orders-date/',function(req,res) {
//
//   Orders.aggregate(
//     [
//      { $unwind : "$orderItems" },
//      { $match : { purchased:true , checkedOut:true} },
//      {
//         $group : {
//           _id  :"$date",
//           userOrders: { "$push": "$$ROOT"},
//           count: { $sum : 1 },
//           total:{$sum:"$orderItems.total"}
//         }
//       }
//     ],
//     function(err,doc) {
//      if(err){
//          res.json({success:false, message:err.errmsg});
//      }else {
//          res.json({success:true, orders:doc});
//      }
//    })
//  });
//
//  router.get('/restaurant-orders-date/',function(req,res) {
//    Orders.aggregate(
//      [
//       { $unwind : "$orderItems" },
//       { $match  : { purchased:true , checkedOut:true , "orderItems.restOwner":req.decoded.UserName } },
//       {
//          $group : {
//            _id  :"$date",
//            userOrders: { "$push": "$$ROOT"},
//            count: { $sum : 1 },
//            total:{$sum:"$orderItems.total"}
//          }
//        }
//      ],
//      function(err,doc) {
//       if(err){
//           res.json({success:false, message:err.errmsg});
//       }else {
//           res.json({success:true, orders:doc});
//       }
//     })
//   });
//
// router.get('/all-orders-companies/',function(req,res) {
//
//   var date = new Date().toJSON().split('T')[0];
//   Restaurant.find({
//     RestOwner : req.decoded.UserName
//   },function(err,Rest) {
//     if(err) {
//       console.log(err)
//     }else if(Rest){
//       console.log("found Rest: ",Rest);
//         Orders.aggregate(
//           [
//             { $sort : { time: 1} },
//          { $unwind : "$orderItems" },
//          {$match : {"orderItems.restOwner": req.decoded.UserName, date:new Date(date),"orderItems.status":{$ne:'rejected'},checkedOut:true} },
//            {
//               $group : {
//                 _id :"$company",
//                 order: { "$push": "$$ROOT"},
//                 count: { $sum: 1 },
//                 total:{$sum:"$orderItems.total"}
//               }
//             }
//          ],
//          function(err,orders) {
//           if(err){
//               res.json({success:false, message:err.errmsg});
//
//           }else {
//                res.json({success:true, orders:orders,date:date});
//           }
//         })
//
//
//     }
//   });
// });
//
// router.get('/all-orders-users/',userRoles,function(req,res) {
//   var date = new Date().toJSON().split('T')[0];
//   Orders.aggregate(
//     [
//       { $unwind : "$orderItems" },
//       {$match : {date:new Date(date),purchased:false,checkedOut:true} },
//       { $group : {
//               _id : "$orderedBy",
//               order: { "$push": "$$ROOT"},
//               count: { $sum: 1 },
//               total:{$sum:"$orderItems.total"}
//         }
//       }
//    ],
//    function(err,doc) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//         res.json({success:true, orders:doc,date:date,authorized:true});
//     }
//   })
// });
//
//
// router.post('/orders/',function (req,res) {
//   var update;
//   if(req.body._id) {
//     update = {
//       $set:{orderItems:req.body.Items}
//     }
//     Orders.findOneAndUpdate({_id: req.body._id},update,function (err, doc) {
//         if (err) {
//           res.json({success:false, message:err});
//         }else {
//           res.json({success:true, doc:doc, message:"Item Was Added To Your Cart"})
//         }
//       })
//   }
//   else {
//     var orders = new Orders();
//     orders.orderedBy = req.decoded.UserName;
//     orders.recipientId = 'aa11';
//     orders.company = "ASAL Technologies"
//     orders.orderItems = req.body.Items;
//     orders.time = "12:00 PM"
//     orders.date = new Date().toJSON().split('T')[0];
//     orders.restaurant = req.body.restaurant;
//     orders.save(function(err,doc) {
//       if (err) {
//         res.json({success:false, message:err});
//       }else {
//         res.json({success:true, doc:doc, message:"Item Was Added To Your Cart"})
//       }
//     });
//   }
//   });
//
//   router.get('/orders/',function(req,res) {
//     var username = req.decoded.UserName;
//     var date = new Date().toJSON().split('T')[0];
//     var query = {
//       orderedBy:username,
//       date:date
//     }
//     Orders.findOne(query, function(err, doc) {
//       if(err)
//         res.json({message:err.message})
//       else {
//         res.json({orders:doc});
//       }
//     });
//   });
//
//   router.post('/solve-notifications',function(req,res) {
//     var url = req.body.url;
//     var username = req.decoded.UserName;
//     Notifications.update({action:url,username:username},{read:true},{multi:true},function(err,doc) {
//       if(err) {
//         res.json({success:false, message:err});
//       }else {
//         io.send('notification',"REFRESH-Notifications");
//         res.json({success:true, doc:doc, message:"Notifications Were set as read"})
//       }
//     });
//   });
//
//   router.post('/notify-users/',function(req,res) {
//     var usernames = [];
//     var query = {
//       "orderItems.restaurant" : req.body.id
//     }
//     Orders.find(query, function(err, doc) {
//       if(err)
//         res.json({success:false,message:err.message})
//       else {
//         for(var i in doc) {
//           usernames.push(doc[i].orderedBy);
//         }
//         for(var i in usernames) {
//           notification = new Notifications();
//           notification.message = "Your Order Has Arrived";
//           notification.username = usernames[i];
//           notification.action = 'ORDER-ARRIVAL';
//           notification.time = new Date().toLocaleTimeString();
//           notification.save();
//         }
//         io.send('notification',"ORDER-ARRIVAL");
//         res.json({success:true,doc:doc,message:'all users were notified'});
//       }
//     });
//   });
//
//
// router.post('/change-order-status/',function(req,res) {
//   Orders.update(req.body.order,
//   {
//     "$set":
//       {
//         "orderItems.$.status": req.body.status
//       }
//   },function(err,doc) {
//   if(err){
//       res.json({success:false, message:err.errmsg});
//   }else {
//     //send notification to user
//     notification = new Notifications();
//     if(req.body.status != 'pending') {
//       notification.message = "your Order Item has been " + req.body.status;
//     }
//     else {
//       notification.message = "your Order Item status was changed";
//     }
//     notification.username = req.body.order.orderedBy;
//     notification.action = '/my-orders';
//     notification.time = new Date().toLocaleTimeString();
//     notification.save();
//
//     //send notification to company Receptionist
//     notification = new Notifications();
//     notification.message = "An Order Has Been " + req.body.status;
//     notification.username = req.body.order.recipientId;
//     notification.action = '/Receptionist';
//     notification.time = new Date().toLocaleTimeString();
//     notification.save();
//
//     io.send('notification',"ORDER-STATUS-CHANGED");
//     res.json({success:true, message:"Order Status Was Changed" ,orders:doc});
//   }
// })
// });
//
// router.post('/change-all-orders-status',function(req,res) {
//   var ids = req.body.ids;
//   var status = req.body.status;
//   Orders.find(
//     { "orderItems":  {
//         "$elemMatch": { "_id": { $in: ids }}
//     }},
//     function(err,doc) {
//       if(err) {
//         res.json({success:false, message:err.message})
//       }else{
//         for(var i=0;i<doc.length;i++) {
//           for(var j=0;j<doc[i].orderItems.length;j++) {
//             if(ids.indexOf(doc[i].orderItems[j]._id.toString()) > -1) {
//               doc[i].orderItems[j].status = status;
//             }
//           }
//           doc[i].save();
//         }
//         res.json({success:true, message:"all orders were updated",orders:doc});
//       }
//   })
// });
//
// router.post('/orders/checkout',function(req,res) {
//   var username = req.decoded.UserName;
//   var date = new Date().toJSON().split('T')[0];
//   var query = {
//     checkedOut:true,
//     time:req.body.time
//   }
//   Orders.findOneAndUpdate(
//     {orderedBy:username,
//     date:date},
//     query, function(err, doc) {
//     if(err)
//       res.json({success:false, message:err.message})
//     else {
//       var x = "";
//       for(var i=0;i<doc.orderItems.length;i++) {
//         if(x != doc.orderItems[i].restOwner) {
//           notification = new Notifications();
//           notification.message = username + " has checkedOut his order";
//           notification.username = doc.orderItems[i].restOwner;
//           x = notification.username;
//           notification.time = new Date().toLocaleTimeString();
//           notification.action = '/restaurant-recipient';
//           notification.save();
//         }
//       }
//       io.send('notification',"ORDER-CHECKOUT");
//       res.json({success:true, message:"order was checkedOut ... redireting to orders page",orders:doc});
//     }
//   });
// });
//
// router.post('/AddItem/',function (req,res) {
//    Restaurant.findOneAndUpdate({_id:req.body.RestId},{$addToSet:{Items:{_id:new mongoose.Types.ObjectId,ItemName:req.body.ItemName,ItemPrice:req.body.ItemPrice,ItemDesc:req.body.ItemDesc,ItemCate:req.body.ItemCate}}},function (err, doc) {
//     if (err) {
//        res.json({success:false, message:err});
//    }else {
//      res.json({success:true, item:doc, message:"Item added successfully"});
//    }
//    });
// });
//
//
// // to implement
// router.post('/deleteCartItem/',userRoles,function(req,res) {
//   if(req.body.items.length == 0) {
//     Orders.remove({ _id: req.body._id },function(err,doc) {
//       if (err) {
//         res.json({success:false, message:err});
//       }else {
//         res.json({success:true, doc:doc, message:"Item Was Removed From Cart"})
//       }
//     });
//   }
//   else {
//     update = {
//       $set:{orderItems:req.body.items}
//     }
//     Orders.findOneAndUpdate(
//       {_id: req.body._id},update,function (err, doc) {
//         if (err) {
//           res.json({success:false, message:err});
//         }else {
//           res.json({success:true, doc:doc, message:"Item Was Removed From Cart"})
//         }
//       });
//   }
// });
//
// router.get('/restaurant/:id',function (req,res) {
//   Restaurant.findOne({_id:req.params.id},function (err,doc) {
//     if(err){
//         res.json({success:false, message:err.errmsg});
//     }else {
//         res.json({success:true, restaurant:doc});
//     }
//   });
// });
//
// router.post('/editItem/',function (req,res) {
//
//   Restaurant.findOneAndUpdate({'_id':req.query.RestId,'Items._id':req.query._id},{$set:{'Items.$.ItemName':req.query.ItemName,'Items.$.ItemPrice':req.query.ItemPrice,'Items.$.ItemDesc':req.query.ItemDesc,'Items.$.ItemCate':req.query.ItemCate}},function (err, doc) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//     console.log(doc);
//      res.json({success:true, item:req.query, message:"Item edited successfully"});
//   }
//   });
//
// });
//
//
// router.put('/management/editUser/',vadlidateUpdatedUser,function (req,res) {
//
//   var id = req.body._id;
//   var FullName=req.body.FullName;
//   var Email=req.body.Email;
//   var UserName=req.body.UserName;
//   var Permission=req.body.Permission;
//
//   User.findOneAndUpdate({_id:id},{$set:{FullName:FullName, Email:Email, UserName: UserName,Permission:Permission}}).then(function(user) {
//   if(user.Permission=="Restaurant"){
//       Restaurant.update({RestOwner:user.UserName},{$set:{RestOwner:UserName}}).then(function (doc) {
//         res.json({success:true , message:"user updates successfuly",user:user});
//       });
//     }else {
//       res.json({success:true , message:"user updates successfuly",user:user});
//     }
//     }).catch(function (err) {
//     res.json({success:false , err: err});
//   });
//
// });
//
// router.put('/saveFreeDays/',function (req,res) {
//   console.log("zaaroooor" , req.body);
//   Restaurant.update({"_id":req.body.RestId},{"$set":{"Offers.FreeDays":req.body.FreeDays}},function (err, doc) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//     console.log(doc);
//      res.json({success:true, item:req.query, message:"Free delivery days was saved successfully"});
//   }
//   });
//
// });
//
// router.put('/saveDeliveryPrices/',function (req,res) {
//   Restaurant.update({"_id":req.body.RestId},{"$set":{"Offers.RegularDeliveryPrice":req.body.RegularDeliveryPrice,"Offers.MinDeliveryPrice":req.body.MinDeliveryPrice}},function (err, doc) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//     console.log(doc);
//      res.json({success:true, item:req.query, message:"Delivery prices days was saved successfully"});
//   }
//   });
// });
//
// router.get('/getOffers/:RestId',function (req,res) {
//       Restaurant.findOne({"_id":req.params.RestId}).select("Offers").then(function (Offers,err) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//       res.json({success:true, Offers:Offers});
//   }
//   });
//
// });
//
// router.delete('/deleteRest/',function (req,res) {
// console.log(req.query);
//       Restaurant.deleteOne({_id:req.query.RestId}).then(function (result,err) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//
//      res.json({success:true, message:"restaurant was deleted successfully"});
//   }
// }).catch(function (error) {
//   res.json({success:false, message:error});
// });
//
// });
//
// router.delete('/deleteItem/',function (req,res) {
//
//       Restaurant.update({_id:req.query.RestId},{$pull:{Items:{_id:req.query.ItemId}}},{multi:false}).then(function (result,err) {
//    if (err) {
//       res.json({success:false, message:err});
//   } else {
//
//      res.json({success:true, message:"item was deleted successfully"});
//   }
// }).catch(function (error) {
//   res.json({success:false, message:error});
// });
//
// });
//
// router.removeAllNotifications = function() {
//   Notifications.remove({},function(err,doc) {
//     if(err) {
//       console.log(err);
//     }else {
//       console.log("******************* Remove All Notifications CRON JOB *******************");
//     }
//   })
// }

  return router;
}
//
// // user permission
//  userRoles=function(req,res,next) {
//   console.log("roles of: ",req.decoded.Permission);
//   Permission=req.decoded.Permission;
//    var route = (req.route.path.split("/"));
//   console.log(route[1]);
//
//    if(roles[route[1]].includes(Permission)){
//      req.authorized = true;
//      next();
//    }else {
//       req.authorized=false;
//       res.json({success:false, message:'You dont have suffcient permission',authorized:req.authorized});
//        }
//
// }
//
// //user registration validator
// var vadlidateRegUser= function (req,res,next) {
//   req.checkQuery('UserName','Username must contain letters and numbers only').isAlphanumeric().notEmpty();
//   req.checkQuery('FullName','Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between first, and last name.').matches(/^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$/).notEmpty();
//   req.checkQuery('Email','Email should have a valid syntax e.g: example@example.com').isEmail().notEmpty();
//   req.checkQuery('Password','Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.').matches( /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/).isLength({min:6,max:35}).notEmpty();
//   req.checkQuery('Permission','Invalid Permission').isAlpha().notEmpty();
//
//   var error = req.validationErrors();
//   if(!error){
//     next();
//   }else {
//       res.json({success:true, message:error});
//   }
// }
// var vadlidateUpdatedUser = function (req,res,next) {
//
//   console.log(req);
//   req.checkBody('UserName','UserName Is required').notEmpty();
//   req.checkBody('UserName','Username must contain letters and numbers only').isAlphanumeric();
//   req.checkBody('FullName','FullName Is required').notEmpty();
//   req.checkBody('FullName','FullName must be at least 3 characters, max 30, no special characters or numbers, must have space in between first, and last name.').matches(/^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$/);
//   req.checkBody('Email','Email Is required').notEmpty();
//   req.checkBody('Email','Email should have a valid syntax e.g: example@example.com').isEmail();
//   req.checkBody('Permission','Permission Is required').notEmpty();
//   req.checkBody('Permission','Invalid Permission').isAlpha();
//
//  req.getValidationResult().then(function(result) {
//    if(result.isEmpty()){
//    next();
//    }
//    else {
//      return res.json({success:false, message:result.array()});
//    }
// });
//
//   // var error = req.validationErrors();
//   // if(!error){
//     // next();
//   // }else {
//   //     res.json({success:false, message:error});
//   // }
// }
