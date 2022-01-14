const { createUserValidate, loginUserValidate } = require('../validate/usersValidate');
const usersRepository = require('../database/repositories/usersRepository');
const { hash } = require('../services/passwordServices');
const { setMessageErrorValidation, setMessageErrorUserDB } = require('../services/errors');
const signIn = require('../services/signIn')

const createUser = async (body) => {
    try {
        const { error, value } = createUserValidate.validate(body, { abortEarly: false });
        if (error) {
            return { error: { status: 400, data: setMessageErrorValidation(error.message) } };
        }

        const hashPassword = await hash(value.password);
        const { error: dbError } = await usersRepository.createUser(value, hashPassword);

        if (dbError){
            return { error: { status: 500, data: setMessageErrorUserDB(dbError.message) } };
        }

        return { result: { data: "Registration successful", status: 201 } };
    } catch (err) {
        return { error: err.details[0].message, status: 400 };
    }
};

const login = async (body) => {
    try {
        const { error, value } = loginUserValidate.validate(body);
        if (error) {
            return { error: { status: 400, data: error.message } };
        }

        const { error: tokenError, data: { accessToken, checkUserRole } } = await signIn.loginUser(value);

        if (tokenError) return { error: { status: 401, data: tokenError } };

        return { result: { data: checkUserRole, accessToken, status: 200 } }

    } catch (err) {
        return { error: err };
    }
};


module.exports = {
    createUser,
    login,
}





