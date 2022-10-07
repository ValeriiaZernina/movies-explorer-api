const userRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const userControllers = require("../controllers/users");

// возвращает информацию о пользователе (email и имя)
// GET /users/me
userRouter.get("/users/me", userControllers.getUsers);

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
userRouter.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2).max(30),
    }),
  }),
  userControllers.patchUserMe
);

module.exports = userRouter;
