const winston = require('winston');
const expressWinston = require('express-winston');

// создадим логгер запросов,чтобы хранить информацию о всех запросах к API;
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

// логгер ошибок,чтобы хранить информацию об ошибках, которые возвращает API
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
