require("dotenv").config();
const bcrypt = require("bcrypt"); // импортируем bcrypt
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const { StatusBadRequest } = require("../utils/errors/StatusBadRequest");
const { StatusNotFound } = require("../utils/errors/StatusNotFound");
const { NODE_ENV, JWT_SECRET } = process.env;
const { STATUS_CREATED } = require("../utils/errors/errorsCode");
