const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/index');

const UserSchema = new mongoose.Schema({
  username: {
    type: String, unique: true, required: [true, 'cannot be empty.'], lowercase: true, index: true,
  },
  email: {
    type: String, unique: true, required: [true, 'cannot be empty.'], lowercase: true, index: true,
  },
  bio: String,
  image: String,
  salt: String,
  hash: String,
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign({
    id: this.id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000, 10),
  }, secret);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: this.generateJWT(),
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    following: false,
  };
};

mongoose.model('User', UserSchema);
