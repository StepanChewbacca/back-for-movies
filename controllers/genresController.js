const genresRepository = require('../database/repositories/genresRepository');
const jwtServices = require('../services/jwtServices');

const getGenres = async (query) => {
    try {
        const { error: tokenError } = jwtServices.verifyTokens(query.token);
        if (tokenError) return { error: { message: tokenError, statusCode: 401 } };
        const { error: dbError, result } = await genresRepository.getGenres();
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 200 } };
    } catch (err) {
        return { error: err };
    }
};

module.exports = {getGenres}
