const _ = require('lodash');
const genreRepository = require('../database/repositories/genresRepository');

const formatMovies = async (movies) => {
    const table = []
    for (let element of movies) {
        let id = element.id
        const genres = await genreRepository.getGenresByMovieId(id);
        const row = {
            ..._.omit(element, ['bla']),
            genres,
        }
        table.push(row);
    }
    return table
};

const replaceApostrophe = async (obj) => {
    for (let key in obj) {
        obj[key] = obj[key].replace(/'/gi, '\'\'')
    }
    return obj
}


module.exports = { formatMovies, replaceApostrophe };
