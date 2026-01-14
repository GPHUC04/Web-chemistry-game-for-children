// src/middlewares/paramParser.js
const ApiError = require("../api-error");

const parseParams = (req, res, next) => {
  if (req.params.id) {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return next(new ApiError(400, "ID must be a positive integer"));
    }
    req.params.id = id; // Gán lại id là number
  }
  next();
};

module.exports = { parseParams };
