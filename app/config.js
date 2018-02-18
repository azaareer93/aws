var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    if (file.originalname.match(/\.(exe|bat)$/)) {
        var err = new Error();
        err.code ='filetype';
        return cb(err);
    }else {
      cb(null, Date.now() + '_'  + file.originalname);
    }
  }
});

var upload = multer({ storage: storage }).single('orderFile');

module.exports={
  'storage':storage,
  'upload':upload
}
