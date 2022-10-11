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
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.use(cookieParser());
// обновление, вместо bodyParser
app.use(express.json());
// Cors
app.use(
  cors({
    origin: [
      "https://api.zernina.nomoredomains.icu",
      "https://zernina.nomoredomains.icu",
      "http://zernina.nomoredomains.icu",
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
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
  // console.log(`Сервер запущен на ${PORT}`);
});
