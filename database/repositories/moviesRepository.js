const axios = require('axios');
const pgClient = require('../database');
const { formatMovies, replaceApostrophe } = require('../../services/formatData')

let page = 1;
const getIdMovies = async () => {

    try {
        const { data: { results } } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=483f32e50b323d6e44691437daeb45e7&page=${page}`);
        for (const item of results) {
            setMovies(item);
        }
        page++;
        if (page > 100) {
            return;
        }
        getIdMovies();
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
        if (data && data.results.length >0) {
            const trailer = data.results[0].key;
            const replacedApostrophe = await replaceApostrophe({ title, original_title, overview, tagline })
            const result = await pgClient.query(
                `INSERT INTO movies(adult,
              backdrop_path, budget, homepage,imdb_id, original_language, original_title,
              title, overview, popularity, poster_path, release_date, revenue, runtime,
              tagline, trailer)
         VALUES(${adult},'${backdrop_path}',${budget},'${homepage}',
         '${imdb_id}','${original_language}','${replacedApostrophe.original_title}',
         '${replacedApostrophe.title}','${replacedApostrophe.overview}',${popularity},'${poster_path}',
         '${release_date}',${revenue},${runtime},'${replacedApostrophe.tagline}','${trailer}') returning*;`);

            await getGenresId(result.rows[0].id, genres);
        }

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


const getMovies = async ({ adult, page, perPage, title, languages,
    budget_min, budget_max, genre_id, minDate, maxDate, id}) => {
    const options = [];
    try {
        let pgQuery = `SELECT * FROM movies `;
        let pgQueryCount = 'SELECT COUNT(id) FROM movies '
        if (genre_id) {
            pgQuery = `SELECT * FROM movies LEFT JOIN
    movies_genres ON movies.id = movie_id `;
            pgQueryCount = `SELECT COUNT(id) FROM movies LEFT JOIN
    movies_genres ON movies.id = movie_id `
            options.push(`genre_id = ${genre_id}`);
        }
        if (adult) options.push(`movies.adult = ${adult}`);
        if (budget_min) options.push(`movies.budget > ${budget_min}`);
        if (budget_max) options.push(`movies.budget < ${budget_max}`);
        if (title) options.push(`movies.title ILIKE '%${title}%'`);
        if (languages) options.push(`movies.original_language = '${languages}'`);
        if (minDate && maxDate) options.push(`movies.release_date BETWEEN '${new Date(minDate).toDateString()}' AND '${new Date(maxDate).toDateString()}'`);
        if (id) options.push(`movies.id != ${id}`);
        if (options.length !== 0) {
            pgQuery += `WHERE ${options.join(' AND ')} `;
            pgQueryCount += `WHERE ${options.join(' AND ')} `
            options.length = 0;
        }
        pgQuery += `ORDER BY id OFFSET ${(page - 1) * perPage} LIMIT ${perPage};`;
        console.log(pgQueryCount)
        const movies = await pgClient.query(pgQuery);
        const totalCount = await pgClient.query(pgQueryCount)
        return { result: { data: movies.rows, totalCount : totalCount.rows[0] }};
    }
    catch (err) {
        //console.error('getMovies repo: ', err);
        return { error: err };
    }
}


const getMovieById = async ({id}) => {
    try {
        const movie = await pgClient.query(`SELECT * FROM movies WHERE id = ${id};`);
        return { result: await formatMovies(movie.rows) };

    } catch (err) {
        return { error: err };
    }
};

const getLanguages = async () => {
    try {
        const languages = await pgClient.query(`SELECT DISTINCT(original_language) FROM movies;`);
        return { result: await languages.rows };

    } catch (err) {
        return { error: err };
    }
};

module.exports = {
    getIdMovies,
    setMovies,
    getMovies,
    getMovieById,
    getLanguages
}


