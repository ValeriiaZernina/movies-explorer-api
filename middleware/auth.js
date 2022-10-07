require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UnauthorizedStatus } = require('../utils/errors/UnauthorizedStatus');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // тут вся авторизация

  const { authorization } = req.cookie;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedStatus('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'SECRET',
    );
    // console.log(payload);
  } catch (err) {
    throw new UnauthorizedStatus('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
