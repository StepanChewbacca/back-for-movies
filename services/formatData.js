const genreRepository = require('../database/repositories/genreRepository');

const formatResult = (allMovies) => {
    return allMovies.reduce((acc, item) => {
        const check = acc.find((movie) => movie.id === item.movie_id);
        const genresArr = [];
        if (!check) {

            acc.push({ genres: genresArr, ...item });
        } else {
            check.genres.push(item.genre_id);
        }
        return acc;
    }, []);
};

const formatMovies = async (movies) => {
    const table = []
    for (let element of movies) {
        let id = element.id
        const genres = await genreRepository.getGenresById(id);
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


module.exports = { formatResult, formatMovies };
