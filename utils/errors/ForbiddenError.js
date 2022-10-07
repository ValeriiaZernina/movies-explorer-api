class ForbiddenError extends Error {
  constructor(message = 'Не можете удалить') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  ForbiddenError,
};
