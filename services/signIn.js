
const usersRepository = require('../database/repositories/usersRepository');
const passwordServices = require('../services/passwordServices');
const jwtServices = require('../services/jwtServices');

const loginUser = async ({login, password}) => {
    try {
        const { error: repoError, checkUserRole, checkPassword } = await usersRepository.loginUser(login);
        if (repoError) return repoError;
        if (await passwordServices.compare(password, checkPassword)) {
            const { accessToken } = jwtServices.generateTokens();
            return { data: { checkUserRole, accessToken } };
        }
        return { error: {message: 'Invalid login or password', statusCode: 401} };

    } catch (err) {
        return { error: err };
    }
};

module.exports = { loginUser }
