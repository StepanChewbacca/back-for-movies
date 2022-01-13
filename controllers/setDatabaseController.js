const axios = require('axios');
const userController = require('../controllers/usersController');
const genreRepository = require('../database/repositories/genresRepository');
const moviesRepository = require('../database/repositories/moviesRepository');
const jwtServices = require('../services/jwtServices');


const setDatabase = async ({ login, password, api_key }, token) => {
    try {
        const { error: tokenError } = jwtServices.verifyTokens(token);
        if (tokenError) return { error: { message: tokenError, statusCode: 401 } };
        const { result } = await userController.login({ login, password })
        console.log(result)
        if (!result || result.data !== 'admin') return { error: "User is not admin" };
        await setGenres(api_key)

        const { error: dbError } = await setMovies()

        if (dbError) return { error: { status: 500, data: dbError } };
        return { result: { data: 'Movies was set', status: 201 } };
    } catch (err) {
        console.error('getGenres: ', err);
        return { error: err };
    }

};

const setGenres = async (api_key) => {
    try {
        const { data: { genres } } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`);
        for (const item of genres) {
            const genreName = await genreRepository.getGenreByName(item)
            if (!genreName) {
                const { error: dbError } = await genreRepository.setGenres(item);
                if (dbError) return { error: { status: 500, data: dbError } };
            }
        }
    } catch (err) {
        console.error('getGenres: ', err);
        return { error: err };
    }

};

const setMovies = async () => {
    try {
        await moviesRepository.getIdMovies();
        return { data: "Movies was set" };
    } catch (err) {
        return { error: err };
    }
};

module.exports = { setDatabase };
