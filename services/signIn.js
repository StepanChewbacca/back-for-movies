
const usersRepository = require('../database/repositories/usersRepository');
const passwordServices = require('../services/passwordServices');
const jwtServices = require('../services/jwtServices');

const loginUser = async ({login, password}) => {
    try {
        const { error: repoError, checkUserRole, checkPassword } = await usersRepository.loginUser(login);
        if (repoError) return repoError;
        const { error } = await passwordServices.compare(password, checkPassword);
        const { accessToken } = jwtServices.generateTokens();
        if (error) return error;
        return { data: { checkUserRole, accessToken } };

    } catch (err) {
        return { error: err };
    }
};

module.exports = { loginUser }