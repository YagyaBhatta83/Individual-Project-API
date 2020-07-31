const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const bcrypt = require("bcryptjs");

require('dotenv').config();

const DB_URL = process.env.URL;

module.exports = {
    express,
    mongoose,
    DB_URL,
    multer,
    jwt,
    bcrypt
}