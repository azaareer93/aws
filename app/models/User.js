var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');
var titlize    = require('mongoose-title-case');
var validate   = require('mongoose-validator');
var Promise          = require('mpromise');
mongoose.Promise=Promise;

// // User Name Validator
// var nameValidator = [
//     validate({
//         isAsync: true,
//         validator: 'matches',
//         arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,30})+)+$/,
//         message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
//     }),
//     validate({
//         isAsync: true,
//         validator: 'isLength',
//         arguments: [3, 30],
//         message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
//     })
// ];
//
// // User E-mail Validator
// var emailValidator = [
//     validate({
//         isAsync: true,
//         validator: 'matches',
//         arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
//         message: 'Email should have a valid syntax e.g: example@example.com'
//     }),
//     validate({
//         isAsync: true,
//         validator: 'isLength',
//         arguments: [3, 30],
//         message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
//     })
// ];
//
// // Username Validator
var usernameValidator = [
    validate({
        isAsync: true,
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        isAsync: true,
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];
//
// // Password Validator
// var passwordValidator = [
//     validate({
//         isAsync: true,
//         validator: 'matches',
//         arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/,
//         message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
//     }),
//     validate({
//         isAsync: true,
//         validator: 'isLength',
//         arguments: [6, 35],
//         message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
//     })
// ];



var UserSchema = new Schema({
  UserName:{ type:String, lowercase:true, required:true, unique:true,validate: usernameValidator},
  Password:{ type:String, required:true},
  Approved:{type:Boolean, required:true, default:true},
  Role:{ type:String, required:true, default:'ADMIN'},



  });
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.Password, null, null, function(err, hash){
    user.Password=hash;
    next();
    });

});

// UserSchema.plugin(titlize, {
//   paths: [ 'FullName']
// });

UserSchema.methods.comparePassword = function (Password) {
  return bcrypt.compareSync(Password, this.Password);
};

module.exports=mongoose.model('User',UserSchema);
