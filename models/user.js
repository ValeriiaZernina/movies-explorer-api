// Поля схемы user:
// email — почта пользователя, по которой он регистрируется. Это обязательное поле, уникальное для каждого пользователя. Также оно должно валидироваться на соответствие схеме электронной почты.
// password — хеш пароля. Обязательное поле-строка. Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле.
// name — имя пользователя, например: Александр или Мария. Это обязательное поле-строка от 2 до 30 символов.

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt"); // импортируем bcrypt
const { UnauthorizedStatus } = require("../utils/errors/UnauthorizedStatus");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: [validator.isEmail, "Некорректный email"],
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: "Валерия Зернина",
  },
});

userSchema.statics.findUserByCredentials = function test(email, password) {
  return this.findOne({ email })
    .select("+password")
    .orFail(() => {
      throw new UnauthorizedStatus();
    })
    .then((user) =>
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedStatus();
        }
        return user;
      })
    );
};

module.exports = mongoose.model("user", userSchema);
