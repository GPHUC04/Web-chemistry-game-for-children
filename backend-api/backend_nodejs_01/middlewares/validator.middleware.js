const { z } = require("zod");
const ApiError = require("../api-error");

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const data = {
        ...req.body,
        ...req.params,
        ...req.query,
      };
      const parsed = schema.parse(data);
      req.validatedData = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            return `${err.path.join(".")}: ${err.message}`;
          })
          .join("; ");
        console.error("Validation error:", errorMessages);
        return res.status(400).json({
          code: 400,
          message: errorMessages,
        });
      }
      next(error);
    }
  };
};

module.exports = { validateRequest };
