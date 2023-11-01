const express = require('express');
const router = express.Router();
const { userSchema } = require('../models/user.js');
const { questionSchema } = require('../models/question.js');

const Joi = require('joi');
const crypt = require('bcryptjs');

// branch: new1

module.exports = router;