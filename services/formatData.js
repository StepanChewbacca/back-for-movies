const genreRepository = require('../database/repositories/genresRepository');

const formatMovies = async (movies) => {
    const table = []
    for (let element of movies) {
        let id = element.id
        const genres = await genreRepository.getGenresByMovieId(id);
        const row = {
            id: element.id,
            adult: element.adult,
            backdrop_path: element.backdrop_path,
            budget: element.budget,
            homepage: element.homepage,
            imdb_id: element.imdb_id,
            original_language: element.original_language,
            original_title: element.original_title,
            title: element.title,
            overview: element.overview,
            popularity: element.popularity,
            poster_path: element.poster_path,
            release_date: element.release_date,
            revenue: element.revenue,
            runtime: element.runtime,
            tagline: element.tagline,
            trailer: element.trailer,
            genres: genres
        }
        table.push(row);
    }
    return table
};

// const replaceApostrophe = async (arr) => {
//     const obj = {}
//     for (let element of arr) {
//         obj[element] = element.replace(/'/gi, '\'\'')
//     }
//     return obj
// }


module.exports = { formatMovies, };
