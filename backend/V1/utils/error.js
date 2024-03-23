export const ErrorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  error.failed = true;

  return error;
};
