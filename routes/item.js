const {express,path,multer}=require('./../config');
const router = express.Router();
const Item = require("../models/item");
const auth = require('../auth');


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