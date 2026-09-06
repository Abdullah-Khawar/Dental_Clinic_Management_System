import httpStatusCodes from "./httpStatusCodes.js";

const successResponse = (res, message = "OK", data = {}) => {
  return res.status(httpStatusCodes.OK).json({
    error: false,
    message: message,
    data: data,
    code: httpStatusCodes.OK,
  });
};

const badRequestResponse = (res, message = "BAD_REQUEST", data = {}) => {
  return res.status(httpStatusCodes.BAD_REQUEST).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.BAD_REQUEST,
  });
};

const notFoundResponse = (res, message = "NOT_FOUND", data = {}) => {
  return res.status(httpStatusCodes.NOT_FOUND).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.NOT_FOUND,
  });
};

const internalServerErrorResponse = (
  res,
  message = "INTERNAL_SERVER_ERROR",
  data = {},
) => {
  return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.INTERNAL_SERVER_ERROR,
  });
};

const notAllowedResponse = (res, message = "METHOD_NOT_ALLOWED", data = {}) => {
  return res.status(httpStatusCodes.NOT_ALLOWED).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.NOT_ALLOWED,
  });
};

const conflictResponse = (res, message = "CONFLICT", data = {}) => {
  return res.status(httpStatusCodes.CONFLICT).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.CONFLICT,
  });
};

const unauthorizedResponse = (res, message = "UNAUTHORIZED", data = {}) => {
  return res.status(httpStatusCodes.UNAUTHORIZED).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.UNAUTHORIZED,
  });
};

const forbiddenResponse = (res, message = "FORBIDDEN", data = {}) => {
  return res.status(httpStatusCodes.FORBIDDEN).json({
    error: true,
    message: message,
    data: data,
    code: httpStatusCodes.FORBIDDEN,
  });
};

const noContentResponse = (res, message = "NO_CONTENT", data = {}) => {
  return res.status(httpStatusCodes.NO_CONTENT_SUCCESS).json({
    error: false,
    message: message,
    data: data,
    code: httpStatusCodes.NO_CONTENT_SUCCESS,
  });
};

const createdResponse = (res, message = "CREATED", data = {}) => {
  return res.status(httpStatusCodes.CREATED).json({
    error: false,
    message: message,
    data: data,
    code: httpStatusCodes.CREATED,
  });
};

export {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  internalServerErrorResponse,
  notAllowedResponse,
  conflictResponse,
  unauthorizedResponse,
  forbiddenResponse,
  noContentResponse,
  createdResponse,
};
