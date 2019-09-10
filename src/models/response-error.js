class ResponseError extends Error {
  constructor (errorType, message, ...rest) {
    super(message, ...rest);
    this.errorType = errorType;
  }
}

module.exports = ResponseError;
