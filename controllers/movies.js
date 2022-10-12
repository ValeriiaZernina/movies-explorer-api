const { StatusBadRequest } = require("../utils/errors/StatusBadRequest");
const { StatusNotFound } = require("../utils/errors/StatusNotFound");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { STATUS_CREATED } = require("../utils/errors/errorsCode");
const movieModel = require("../models/movie");

module.exports.createMovie = (req, res, next) => {
  movieModel
    .create({
      ...req.body,
      owner: req.user._id,
    })
    .then((movie) => {
      res.status(STATUS_CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new StatusBadRequest("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const { _id: id } = req.user;
  movieModel
    .find({ owner: id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new StatusBadRequest("Некорректный id"));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId: id } = req.params;
  movieModel
    .findById(id)
    .orFail(() => {
      throw new StatusNotFound("Ничего не удалилось.");
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError("У вас нет доступа к чужим фильмам.");
      }
      return movie.deleteOne();
    })
    .then(() => res.send({ message: "Карточка удалена." }))
    .catch(next);
};
