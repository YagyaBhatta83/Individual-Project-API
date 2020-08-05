const {express,path,multer}=require('./../config');
const router = express.Router();
const Item = require("../models/item");
const auth = require('../auth');

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
})


router.post("/items",auth.verifyUser, auth.verifyAdmin,upload.single('image'), (req, res, next) => {

    Item.create({
            name:req.body.name,
            price:req.body.price,
            image:req.body.image || req.file.path
        })
    .then((item) => {
        res.statusCode = 201;
        res.json(item);
    })
    .catch(err => {
         next(err);
      });
  });

  router.get("/items", (req, res, next) => {
    Item.find({})
        .then((item) => {
          res.json(item);
        })
        .catch(err=>next(err));
  });
  
  router.route('/items/:id')
  .get((req, res, next) => {
      Item.findById(req.params.id)
          .populate({
              path: 'item',
              select: 'name'
          })
          .then((item) => {
              res.json(item);
          }).catch(err=>next(err));
      })