require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedStatus = require("../utils/errors/UnauthorizedStatus");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // тут вся авторизация
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new UnauthorizedStatus("Необходима авторизация");
  }
  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "SECRET"
    );
    // console.log(payload);
  } catch (err) {
    throw new UnauthorizedStatus("Необходима авторизация");
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
