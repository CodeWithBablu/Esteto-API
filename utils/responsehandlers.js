export const handleError = (statuscode, message) => {
  const error = new Error();
  error.statuscode = statuscode;
  error.message = message;
  return error;
};

export const success = (statuscode, message, data) => {
  return {
    success: true,
    statuscode,
    message,
    value: data,
  };
};
