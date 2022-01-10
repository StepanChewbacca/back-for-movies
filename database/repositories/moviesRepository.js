const axios = require('axios');
const pgClient = require('../database');
const moviesValidate = require('../../validate/getMoviesValidate')
const { formatMovies } = require('../../services/formatData')

let page = 1;
const getIdMovies = async () => {

    try {
        const { data: { results } } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=483f32e50b323d6e44691437daeb45e7&page=${page}`);
        for (const item of results) {
            await setMovies(item);
        }
        page++;
        if (page > 2) {
            return;
        }
        await getIdMovies();
    } catch (err) {
        console.error('getIdMovies: ', err);
        return { error: err };
    }
};

const setMovies = async ({ id }) => {
    try {

        let { data: { adult, backdrop_path, budget, homepage, imdb_id, original_language, original_title, title, overview, popularity, poster_path, release_date, revenue, runtime, genres, tagline } } = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=483f32e50b323d6e44691437daeb45e7`);

        const idResult = await pgClient.query(`SELECT imdb_id FROM movies WHERE imdb_id='${imdb_id}';`);
        if (idResult.rowCount !== 0) return { error: "The movie is exist in dataBase" };
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=483f32e50b323d6e44691437daeb45e7`);
        const trailer = data.results[0].key;
        tagline = tagline.replace(/'/gi, '\'\'');
        original_title = original_title.replace(/'/gi, '\'\'');
        title = title.replace(/'/gi, '\'\'');
        overview = overview.replace(/'/gi, '\'\'');
        const result = await pgClient.query(`INSERT INTO movies(adult, backdrop_path, budget, homepage, imdb_id, original_language, original_title, title, overview, popularity, poster_path, release_date, revenue, runtime,tagline, trailer)
        VALUES(${adult},'${backdrop_path}',${budget},'${homepage}','${imdb_id}','${original_language}','${original_title}', '${title}','${overview}',${popularity},'${poster_path}','${release_date}',${revenue},${runtime},'${tagline}','${trailer}') returning*;`);

        await getGenresId(result.rows[0].id, genres);

        return { data: "Films was inserted" };
    } catch (err) {
        console.error('setMovies: ', err);
        return { error: err };
    }
};

const getGenresId = async (movieId, genresArray) => {
    try {
        for (const item of genresArray) {
            await setMoviesGenres(movieId, item);
        }
    } catch (err) {
        console.error('getGenresId: ', err);
        return { error: err };
    }
};

const setMoviesGenres = async (movieId, { id: genresId }) => {
    try {
        await pgClient.query(`INSERT INTO movies_genres(movie_id,genre_id) 
        VALUES(${movieId},${genresId});`);
    } catch (err) {
        console.error('setMoviesGenres: ', err);
        return { error: err };
    }
};


const getMovies = async ( {adult, page, perPage, title, languages,
                             budget_min, budget_max, genre_id} ) => {
    const options = [];
    try {
        let pgQuery = `SELECT * FROM movies `;
        if (genre_id) {
            pgQuery = `SELECT * FROM movies LEFT JOIN
    movies_genres ON movies.id = movie_id `;
            options.push(`genre_id = ${genre_id}`);
        }
        if (adult) options.push(`movies.adult = ${adult}`);
        if (budget_min) options.push(`movies.budget > ${budget_min}`);
        if (budget_max) options.push(`movies.budget < ${budget_max}`);
        if (title) options.push(`movies.title ILIKE '%${title}%'`);
        if (genre_id) options.push(`genre_id = ${genre_id}`);
        if (languages) options.push(`movies.original_language = '${languages}'`);
        if (options.length !== 0) {
            pgQuery += `WHERE ${options.join(' AND ')} `;
            options.length = 0;
        }
        pgQuery += `ORDER BY id OFFSET ${(page - 1) * perPage} LIMIT ${perPage};`;
        const movies = await pgClient.query(pgQuery);
        return movies.rows;
    }
    catch (err) {
        console.error('getMovies repo: ', err);
        return { error: err };
    }
}

const getMovieById = async (movie_id) => {
    try {
        const movie = await pgClient.query(`SELECT * FROM movies WHERE id = ${movie_id};`);
        return { result:  await formatMovies(movie.rows) };

    } catch (err) {
        console.error('getMovies repo: ', err);
        return { error: err };
    }
};

module.exports = {
    getIdMovies,
    setMovies,
    getMovies,
    getMovieById
}


