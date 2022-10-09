require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { handleError } = require("./utils/handleError");
const router = require("./routes/index");

// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/diplom", {
  useNewUrlParser: true,
});

app.use(cookieParser());
// обновление, вместо bodyParser
app.use(express.json());
// Cors
app.use(cors({}));
// подключаем роуты
app.use(router);
// подключаем логгер запросов
app.use(requestLogger);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
