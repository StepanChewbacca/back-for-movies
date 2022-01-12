const pgClient = require('../database');

const getGenreByName = async ({ name }) => {
    try {
        const genre = await pgClient.query(`SELECT name FROM genres WHERE name='${name}';`);
        return genre.rows[0];
    } catch (err) {
        return { error: err };
    }
};

const getGenres = async () => {
    try {
        const genres = await pgClient.query(`SELECT * FROM genres`);
        return { result: genres.rows };
    } catch (err) {
        return { error: err };
    }
};

const setGenres = async ({ id, name }) => {
    try {
        const result = await pgClient.query(`INSERT INTO genres(id,name) VALUES(${id},'${name}');`);
        return { result: result };
    } catch (err) {
        return { error: err };
    }
};

const getGenresByMovieId = async (movie_id) => {
    try {
        const genre = await pgClient.query(`SELECT genre_id FROM movies_genres WHERE movie_id = ${movie_id};`);
        return genre.rows.map((genr) => genr.id)
        // const values = genre.rows.map(e => Object.values(e));
        // const result = values.flat();
        // return  result ;
    } catch (err) {
        return { error: err };
    }
};

module.exports = {
    setGenres,
    getGenreByName,
    getGenresByMovieId,
    getGenres
};
