const movieRouter = require("express").Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");
const {
  validateMoviePost,
  validateMovieDelete,
} = require("../middleware/joiValidation");

// возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
movieRouter.get("/", getMovies);

// создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies
movieRouter.post("/", validateMoviePost, createMovie);

// удаляет сохранённый фильм по id
// DELETE /movies/_id
movieRouter.delete("/:movieId", validateMovieDelete, deleteMovie);

module.exports = movieRouter;
