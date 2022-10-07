const userRouter = require("express").Router();
const auth = require("../middleware/auth");
const { celebrate, Joi } = require("celebrate");
const userControllers = require("../controllers/users");

// возвращает информацию о пользователе (email и имя)
// GET /users/me
userRouter.get("/users/me", auth, userControllers.getUsersMe);

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
userRouter.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: false } }),
    }),
  }),
  auth,
  userControllers.patchUserMe
);

// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup
userRouter.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  userControllers.createUser
);

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
userRouter.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  userControllers.login
);

// выход из системы
userRouter.get("/signout", auth, userControllers.signout);

module.exports = userRouter;
