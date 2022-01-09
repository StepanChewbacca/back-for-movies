const  { createUserValidate, loginUserValidate } = require('../validate/usersValidate');
const usersRepository = require('../database/repositories/usersRepository');
const { hash }  = require('../services/passwordServices');

const createUser = async (body) => {
    try {
        const { error, value } = await createUserValidate.validate(body);
        if (error) {
            return { error: { status: 400, data: "error.message" } };
        }
        const hashPassword = await hash(value.password);

        const { error: dbError, result } = await usersRepository.createUser(value, hashPassword);

        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 201 } };

    } catch (err) {
        console.error(err);

        return { error: err.details[0].message };
    }
};

const loginUser = async (body) => {
    try {
        const { error, value } = await loginUserValidate.validate(body);
        if (error) {
            return { error: { status: 400, data: error.message } };
        }

        const { error: dbError, result } = await usersRepository.loginUser(value);
        if (!result) return { error: "Login not found" };

        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 200 } };

    } catch (err) {
        return { error: err.details[0].message };
    }
};

module.exports = {
    createUser,
    loginUser
}





