const { express, bcrypt, multer, path, jwt } = require("./../config");
const router = express.Router();
const User = require("../models/users");
const auth = require("../auth");

router
  .route("/users/signup")
  .post((req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        let err = new Error("Could not hash!");
        err.status = 500;
        return next(err);
      }
      User.create({
        fullName: req.body.fullName,
        username: req.body.username,
        password: hash,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location
      })
        .then(user => {
          let token = jwt.sign({ _id: user._id }, process.env.SECRET);
          res.json({ status: "Signup success!", token: token });
        })
        .catch(err => next(err));
    });
  });

router
  .route("/users/login")
  .post((req, res, next) => {
    User.findOne({ username: req.body.username })
      .then(user => {
        // console.log(user.username);
        if (user == null) {
          let err = new Error("username not found!");
          err.status = 401;
          return next(err);
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then(isMatch => {
              // console.log(req.body.password);
              //   console.log(user.password);
              if (!isMatch) {
                let err = new Error("Password does not match!");
                err.status = 401;
                return next(err);
              }
              let token = jwt.sign({ _id: user._id }, process.env.SECRET);
              res.json({ status: "Login success!", token: token });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  });

router
  .route("/users")
  .get((req, res, next) => {
    User.find({})
      .then(user => {
        res.json(user);
      })
      .catch(err => next(err));
  });

router
  .route("/users/:id")
  .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    User.findOneAndDelete(req.params.id)
      .then(user => {
        if (user == null) throw new Error("User not found!");
        res.json({ msg: "User Deleted Successfully! " });
      })
      .catch(err => next(err));
  });

router.route("/users/me")
.get(auth.verifyUser, (req, res, next) => {
  res.json({
    fullName: req.user.fullName,
    username: req.user.username,
    phoneNumber: req.user.phoneNumber,
    location: req.user.location,
    image: req.user.image
  });
})

  .put(auth.verifyUser, (req, res, next) => {
    // console.log(req.body);
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
      .then(user => {
        res.json({
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          phoneNumber: user.phoneNumber,
          location: user.location,
          image: user.image
        });
      })
      .catch(err => next(err));
  });


router
  .route("/users/:id")
  .get((req, res, next) => {
    User.findById(req.params.id)
      .populate({
        path: "user",
        select: "name"
      })
      .then(user => {
        res.json(user);
      })
      .catch(err => next(err));
  });

//upload image
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
});

router.post(
  "/users/upload",
  auth.verifyUser,
  upload.single("image"),
  (req, res, next) => {
    req.user.image = req.file.path;
    req.user
      .save()
      .then(user => {
        res.json({ status: "200", message: "Image Uploaded" });
      })
      .catch(err => next(err));
  }
);

module.exports = router;