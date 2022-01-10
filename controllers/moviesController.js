const moviesRepository = require('../database/repositories/moviesRepository');
const getMoviesValidate = require('../validate/getMoviesValidate');
const { formatMovies } = require('../services/formatData');



const getMovies = async (query) => {
    try {
        const value = await getMoviesValidate.getMovieValidate.validateAsync(query);
        const movies = await moviesRepository.getMovies(value);
        if (!movies[0]) return { result: 'Not found', status: 404 };

        return { result: { data: await formatMovies(movies), status: 200 } };
    } catch (err) {
        console.error('getMovies: ', err);
        return { error: err };
    }
};

const getMovieById = async (movie_id) => {
    try {
        const { error: dbError, result } = await moviesRepository.getMovieById(movie_id);
        if (!result[0]) return { result: { data: 'Not found', status: 404 }};
        if (dbError) return { error: { status: 500, data: dbError } };
        console.log(result)
        return { result: { data: result, status: 200 } };
    } catch (err) {
        console.error('getMovieById: ', err);
        return { error: err };
    }
};

module.exports = { getMovies, getMovieById }
