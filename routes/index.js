const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const { login, createUser, signout } = require('../controllers/users');
const auth = require('../middleware/auth');
const {
  validateSignIn,
  validateSignUp,
} = require('../middleware/joiValidation');
const StatusNotFound = require('../utils/errors/StatusNotFound');

// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup
router.post('/signup', validateSignUp, createUser);

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
router.post('/signin', validateSignIn, login);

router.use(auth);
router.get('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('*', (req, res, next) => {
  next(new StatusNotFound('Не существующий маршрут'));
});

module.exports = router;
