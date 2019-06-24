export const appError = (message, statusCode) => {
  return {
    statusCode,
    message
  };
};
