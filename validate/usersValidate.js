const Joi = require('joi');

const regExp = require('../constants/regExp');

const createUserValidate = Joi.object({
    password: Joi.string().trim().alphanum().regex(regExp.CHECK_PASSWORD).required(),
    login: Joi.string().min(6).trim().regex(regExp.CHECK_LOGIN).required(),
    first_name: Joi.string().min(2).trim().regex(regExp.CHECK_NAME).required(),
    last_name: Joi.string().min(2).trim().regex(regExp.CHECK_NAME).required(),
    user_role: Joi.string().trim().default('user')
});

const loginUserValidate = Joi.object({
    password: Joi.string().trim().alphanum().regex(regExp.CHECK_PASSWORD).required(),
    login: Joi.string().min(6).trim().regex(regExp.CHECK_LOGIN).required(),

});


module.exports = {
    createUserValidate,
    loginUserValidate
}
