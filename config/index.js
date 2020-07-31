const express = require('express')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

require('dotenv').config();

const DB_URL = process.env.URL;

module.exports = {
    express,
    mongoose,
    DB_URL,
    jwt,
    bcrypt
}