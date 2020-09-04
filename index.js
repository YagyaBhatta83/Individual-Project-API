const { express, mongoose, cors, DB_URL } = require("./config");

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/users');
const serviceRouter = require('./routes/service');
const itemRouter = require("./routes/item");
const scheduleRouter = require("./routes/schedule");
const auth = require("./auth");

app.use(cors());
app.use(morgan('dev'));

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// // GENERAL ERROR HANDLER EXPRESS MIDDLEWARE
app.use((err, req, res, next) => {
    const message = err.message || "no resource found";
    const status = err.status || 500;
    res.status(status).json({
      message: message
    });
  });
  
  // 404 ERROR ENDPOINT NOT FOUND ERROR HANDLER
  app.use((req, res, next) => {
    const error = new Error("404 undefined endpoints");
  
    error.status = 404;
    throw error;
  });
  
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(connected => {
      console.log("Successfully connected to MongodB server");
      app.listen(process.env.PORT, () => {
        console.log(`App is running at localhost:${process.env.PORT}`);
      });
    })
    .catch(err => {
      console.log(err);
    });