const genresRepository = require('../database/repositories/genresRepository');
const getMoviesValidate = require('../validate/getMoviesValidate');


const getGenres = async () => {
    try {
        const { error: dbError, result } = await genresRepository.getGenres();
        return { result: { data: result, status: 200 } };
    } catch (err) {
        console.error('getMovies: ', err);
        return { error: err };
    }
};

module.exports = {getGenres}
