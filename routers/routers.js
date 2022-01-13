const URL = require('url');
const routes = require('../constants/routes');
const usersController = require('../controllers/usersController');
const setDatabaseController = require('../controllers/setDatabaseController');
const moviesController = require('../controllers/moviesController');
const genresController = require('../controllers/genresController');



const router = async ({ req, res, body }) => {
    try {
        const { pathname, query } = URL.parse(req.url, true);
        let result, error;
        switch (true) {
            case (req.method === 'POST' && pathname === routes.SIGN_UP):
                ({ error, result } = await usersController.createUser(body));
                break;
            case (req.method === 'POST' && pathname === routes.SIGN_IN):
                ({ error, result } = await usersController.login(body));
                break;
             case (req.method === 'POST' && pathname === routes.DATABASE_SET):
                 ({ error, result } = await setDatabaseController.setDatabase(body));
                 break;
            case (req.method === 'GET' && pathname === routes.MOVIES):
                ({ error, result } = await moviesController.getMovies(query));
                break;
            case (req.method === 'GET' && pathname === `${routes.MOVIES}/id`):
                ({ error, result } = await moviesController.getMovieById(query.id));
                break;
            case (req.method === 'GET' && pathname === `${routes.GENRES}`):
                ({ error, result } = await genresController.getGenres());
                break;
                
            default:
                res.statusCode = 404;
                return res.end(JSON.stringify({ message: "route not found" }));
        }

        if (error) {
            res.statusCode = error.status || 400;
            return res.end(JSON.stringify({ message: error }) || JSON.stringify({ message: error.message }));
        }
        if (result.accessToken) res.setHeader('token', result.accessToken);
        res.statusCode = result.status;
        return res.end(JSON.stringify( result.data ));
    } catch (err) {
        console.error('routers error: ', err);
    }
};

module.exports = { router };
