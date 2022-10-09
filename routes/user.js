const userRouter = require("express").Router();

const auth = require("../middleware/auth");
const { getUsersMe, patchUserMe } = require("../controllers/users");
const { validateUserPatch } = require("../middleware/joiValidation");

// возвращает информацию о пользователе (email и имя)
// GET /users/me
userRouter.get("/me", getUsersMe);

// обновляет информацию о пользователе (email и имя)
// PATCH /users/me
userRouter.patch("/me", validateUserPatch, patchUserMe);

module.exports = userRouter;
