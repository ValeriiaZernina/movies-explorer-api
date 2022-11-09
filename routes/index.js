const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const auth = require('../middleware/auth');
const StatusNotFound = require('../utils/errors/StatusNotFound');
const { login, createUser, signout } = require('../controllers/users');
const {
  validateSignIn,
  validateSignUp,
} = require('../middleware/joiValidation');
// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup
router.post('/signup', validateSignUp, createUser);

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
router.post('/signin', validateSignIn, login);
router.post('/signout', signout);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('*', (req, res, next) => {
  next(new StatusNotFound('Не существующий маршрут'));
});

module.exports = router;
