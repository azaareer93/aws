var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;
var validate   = require('mongoose-validator');
var Promise          = require('mpromise');
mongoose.Promise = global.Promise;

 var OrderSchema = new Schema({
   SerialNumber:{
       type:String,
       unique: true,
       null:false,
     },
   TotalPrice:{
       type:Number,
       default:0
     },
    TotalPrice:{
      type:Number,
      default:0
    },
    Payments:[{
      Ammount:{
        type:Number,
        default:0
      },
      PaymentDate:{
          type:Date,
          default:new Date().toJSON().split('T')[0]
      }
    }],
    Status:{
      type:Number,
      default:1
    },
    Note:{
      type:String,
      default:null
    },
    ClientId:{
      type:String,
      default:null
    },
    Items:[{
        Name:{
          type:String,
          default:null
        },
        Quantity:{
          type:String,
          default:null
        },
        Size:{
          type:String,
          default:null
        },
        GColor:{
          type:String,
          default:null
        },
        PColor:{
          type:String,
          default:null
        },
        Tshit:{
          type:Boolean,
          default:null
        },
        Status:{
          type:String,
          default:null
        },
        Note:{
          type:String,
          default:null
        },
        s:{
          type:Number,
          default:null
        },
        m:{
          type:Number,
          default:null
        },
        l:{
          type:Number,
          default:null
        },
        xl:{
          type:Number,
          default:null
        },
        xxl:{
          type:Number,
          default:null
        },
        xxxl:{
          type:Number,
          default:null
        },
        4:{
          type:Number,
          default:null
        },
        6:{
          type:Number,
          default:null
        },
        8:{
          type:Number,
          default:null
        },
        10:{
          type:Number,
          default:null
        },
        12:{
          type:Number,
          default:null
        },
        14:{
          type:Number,
          default:null
        },
        16:{
          type:Number,
          default:null
        },
        18:{
          type:Number,
          default:null
        },
    }],
    date:{
      type:Date,
      required:true,
      default:new Date().toJSON().split('T')[0]
    },
    files:[{
      fileName:{
        type:String,
        required:true
      },
      filePath:{
        type:String,
        required:false
      },
      fileSize:{
        type:String,
        required:false
      },
      fileMimetype:{
        type:String,
        required:false
      }
    }]
});

OrderSchema.pre('save', function(next) {
  var order = this;
    order.SerialNumber=generate(order._id);
    next();
});


var generate = function(string) {
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var ID_LENGTH = 5;
var rtn = '';
for (var i = 0; i < ID_LENGTH; i++) {
  rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
}
return rtn.toLowerCase();
}

module.exports=mongoose.model('Orders',OrderSchema);
