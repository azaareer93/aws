var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/imgs');
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)) {
        var err = new Error();
        err.code ='filetype';
        return cb(err);
    }else {
      cb(null, Date.now() + '_'  + file.originalname);
    }
  }
});

var upload = multer({ storage: storage }).single('RestImg');

module.exports={
  'storage':storage,
  'upload':upload
}
