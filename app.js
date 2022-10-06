require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middleware/logger");

// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// Cors
app.use(cors({}));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

// подключаем логгер запросов
app.use(requestLogger);
// обновление, вместо bodyParser
app.use(express.json());

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
