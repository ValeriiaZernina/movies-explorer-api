require('dotenv').config();
const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { StatusBadRequest } = require('../utils/errors/StatusBadRequest');
const { StatusNotFound } = require('../utils/errors/StatusNotFound');
const { ConflictError } = require('../utils/errors/ConflictError');
const { STATUS_CREATED, STATUS_OK } = require('../utils/errors/errorsCode');

const { NODE_ENV, JWT_SECRET } = process.env;

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => userModel.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(
          new StatusBadRequest(
            'Переданы некорректные данные при создании пользователя пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getUsersMe = (req, res, next) => {
  const { _id: id } = req.user;

  userModel
    .findById(id)
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

module.exports.patchUserMe = (req, res, next) => {
  const { name, email } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new StatusNotFound(`Пользователь с id=${req.user._id} не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new StatusBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'SECRET',
        {
          expiresIn: 1000 * 60 * 60 * 24 * 7,
        },
      );
      res
        .cookie(
          'jwt',
          token, // token - наш JWT токен, который мы отправляем
          {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: false,
          },
        )
        .send({ message: 'Пользователь успешно вошел в систему' });
    })
    .catch((err) => {
      // очищаем куку при неудачном логине
      res.clearCookie('jwt');
      next(err); // пробрасываем ошибку дальше в центральный обработчик
    });
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt').send({
    message: `Пользователь с id=${req.user._id} успешно вышел из системы`,
  });
};
