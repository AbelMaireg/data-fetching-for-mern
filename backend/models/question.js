const Joi = require('joi');

const question = Joi.object({
    text: Joi.string().required(),
    choices: Joi.array().required(),
    answer: Joi.string().required()
});

module.exports = question;