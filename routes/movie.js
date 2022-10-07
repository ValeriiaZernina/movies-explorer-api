const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieControllers = require('../controllers/cards');

// возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
movieRouter.get('/movies', movieControllers.getMovies);

// создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies
movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.string().required().min(2).max(30),
      year: Joi.string().required().min(2).max(30),
      description: Joi.string().required().min(2).max(30),
      image: Joi.string().required().min(2).max(30),
      trailer: Joi.string().required().regex(regex),
      nameRU: Joi.string().required().regex(regex),
      nameEN: Joi.string().required().regex(regex),
      thumbnail: Joi.string().required().regex(regex),
      movieId: Joi.string().required().regex(regex),
    }),
  }),
  movieControllers.createMovie,
);

// удаляет сохранённый фильм по id
// DELETE /movies/_id
movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().alphanum().length(24),
    }),
  }),
  movieControllers.deleteMovie,
);

module.exports = movieRouter;
