import { validationResult } from "express-validator";
import { badRequestResponse } from "../lib/httpResponse.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return badRequestResponse(res, message, { errors: errors.array() });
  }

  next();
};

export default validate;
