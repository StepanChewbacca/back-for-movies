const moviesRepository = require('../database/repositories/moviesRepository');
const getMoviesValidate = require('../validate/getMoviesValidate');
const { formatMovies } = require('../services/formatData');
const jwtServices = require('../services/jwtServices');


const getMovies = async (query) => {
    try {
        const { error: tokenError } = jwtServices.verifyTokens(query.token);
        if (tokenError) return { error: { message: tokenError, statusCode: 401 } };
        const value = await getMoviesValidate.getMovieValidate.validateAsync(query);
        const { dbError, result } = await moviesRepository.getMovies(value);
        if (!result.data[0]) return { result: { data: 'Not found', status: 200 } };
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: { movies: await formatMovies(result.data) , totalCount: result.totalCount }, status: 200 } };
    } catch (err) {
        console.error('getMovies: ', err);
        return { error: err, status: 500};
    }
};

const getMovieById = async (query ) => {
    try {
        const { error: tokenError } = jwtServices.verifyTokens(query.token);
        if (tokenError) return { error: { message: tokenError, statusCode: 401 } };
        const value = await getMoviesValidate.getMovieByIdValidate.validateAsync(query);
        const { error: dbError, result } = await moviesRepository.getMovieById(value);
        if (!result || !result.length ) return { result: { data: 'Not found', status: 404 }};
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 200 } };
    } catch (err) {
        console.error('getMovieById: ', err);
        return { error: err, status: 500 };
    }
};

const getLanguages = async (query) => {
    try {
        const { error: tokenError } = jwtServices.verifyTokens(query.token);
        if (tokenError) return { error: { message: tokenError, statusCode: 401 } };
        const { error: dbError, result } = await moviesRepository.getLanguages();
        if (!result || !result.length ) return { result: { data: 'Not found', status: 404 }};
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 200 } };
    } catch (err) {
        console.error('getMovieById: ', err);
        return { error: err, status: 500 };
    }
};

module.exports = { getMovies, getMovieById, getLanguages }
