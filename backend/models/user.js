const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(6).max(20).required(),
    phone: Joi.number().integer().positive().required(),
    level: Joi.number().min(0).default(0),
    password: Joi.string().min(8).required()
});

const userSignInSchema = Joi.object({
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(8).required()
});

module.exports = { userSchema, userSignInSchema };