const URL = require('url');
const routes = require('../constants/routes');
const userRepository = require('../controllers/usersController');
const setDatabaseController = require('../controllers/setDatabaseController');
const moviesController = require('../controllers/moviesController');



const router = async ({ req, res, body }) => {
    try {
        const { pathname, query } = URL.parse(req.url, true);
        const movie_id = pathname.split('/').at(-1);

        switch (true) {
            case (req.method === 'POST' && pathname === routes.SIGN_UP):
                ({ error, result } = await userRepository.createUser(body));
                break;
            case (req.method === 'POST' && pathname === routes.SIGN_IN):
                ({ error, result } = await userRepository.loginUser(body));
                break;
             case (req.method === 'POST' && pathname === routes.DATABASE_SET):
                 ({ error, result } = await setDatabaseController.setDatabase(body));
                 break;
            case (req.method === 'GET' && pathname === routes.MOVIES):
                ({ error, result } = await moviesController.getMovies(query));
                console.log(result)
                break;
            case (req.method === 'GET' && pathname === `${routes.MOVIES}/${movie_id}`):
                ({ error, result } = await moviesController.getMovieById(movie_id));
                console.log(result)
                break;
            default:
                res.statusCode = 404;
                return res.end(JSON.stringify({ message: "route not found" }));
        }

        if (error) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ message: error }) || JSON.stringify({ message: error.message }));
        }
        //res.statusCode = result.status;
        return res.end(JSON.stringify( result.data ));
    } catch (err) {
        console.error('routers error: ', err);
    }
};

module.exports = { router };