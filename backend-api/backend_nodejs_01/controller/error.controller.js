// src/controllers/error.controller.js
const ApiError = require("../api-error");

const methodNotAllowed = (req, res) => {
  return res.status(405).json({
    status: "error",
    message: `Method ${req.method} is not allowed for this endpoint.`,
  });
};

module.exports = { methodNotAllowed };
