const moviesRepository = require('../database/repositories/moviesRepository');
const getMoviesValidate = require('../validate/getMoviesValidate');
const { formatMovies } = require('../services/formatData');



const getMovies = async (query) => {
    try {
        const value = await getMoviesValidate.getMovieValidate.validateAsync(query);
        const { dbError, result } = await moviesRepository.getMovies(value);
        if (!result[0]) return { result: { data: 'Not found', status: 200 } };
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: await formatMovies(result), status: 200 } };
    } catch (err) {
        console.error('getMovies: ', err);
        return { error: err, status: 500};
    }
};

const getMovieById = async (movie_id) => {
    try {
        const { error: dbError, result } = await moviesRepository.getMovieById(movie_id);
        if (!result || !result.length ) return { result: { data: 'Not found', status: 404 }};
        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: result, status: 200 } };
    } catch (err) {
        console.error('getMovieById: ', err);
        return { error: err, status: 500 };
    }
};

module.exports = { getMovies, getMovieById }
