const Joi = require('joi');


const getMovieValidate = Joi.object({
    page: Joi.number().positive().integer().min(1)
        .default(1),
    perPage: Joi.number().positive().integer().min(1)
        .default(5),
    adult: Joi.boolean(),
    budget: Joi.number().positive().integer().min(0),
    title: Joi.string(),
    languages: Joi.string(),
    budget_min: Joi.number().integer().min(0),
    budget_max: Joi.number().positive().integer().min(0),
    genre_id: Joi.number().positive().integer(),
    minDate: Joi.date(),
    maxDate: Joi.date(),
    id: Joi.number().positive().integer().min(1),
    token: Joi.any()
});

const getMovieByIdValidate = Joi.object({
    id: Joi.number().positive().integer().min(1),
    token: Joi.any()
});
module.exports = {
    getMovieValidate,
    getMovieByIdValidate
}
