const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieControllers = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
movieRouter.get('/movies', auth, movieControllers.getMovies);

// создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies
movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.string().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required(),
      trailer: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required(),
      movieId: Joi.string().required(),
    }),
  }),
  auth,
  movieControllers.createMovie,
);

// удаляет сохранённый фильм по id
// DELETE /movies/_id
movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().alphanum().length(24),
    }),
  }),
  auth,
  movieControllers.deleteMovie,
);

module.exports = movieRouter;
