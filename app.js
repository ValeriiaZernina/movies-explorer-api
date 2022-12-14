require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { handleError } = require('./utils/handleError');
const { limiter } = require('./utils/limiter');
const { MONGO_DEV_URL } = require('./utils/config');
// запуск на 3000 порту
const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_DEV_URL, {
  useNewUrlParser: true,
});
// Cors
app.use(
  cors({
    origin: [
      'https://api.zernina.nomoredomains.icu',
      'https://zernina.nomoredomains.icu',
      'http://zernina.nomoredomains.icu',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);
// подключаем логгер запросов
app.use(requestLogger);
app.use(limiter);
// подключаем Helmet для установки заголовков
app.use(helmet());
app.use(cookieParser());
// обновление, вместо bodyParser
app.use(express.json());
// подключаем роуты
app.use(router);
// подключаем логгер ошибок
app.use(errorLogger);
// обработчик ошибок celebrate
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  // console.log(`Сервер запущен на ${PORT}`);
});
