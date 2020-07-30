
const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const app = express();
app.use(express.json());


mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected to MongodB server");
    }, (err) => console.log(err));




    app.listen(process.env.PORT, () => {
        console.log(`App is running at localhost:${process.env.PORT}`);
    });