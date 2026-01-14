var createError = require("http-errors");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authenticateToken = require("./middlewares/authenticateToken");
require("dotenv").config();

var app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: "*", // Cho phép tất cả origin (điều chỉnh cho production)
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Cấu hình giới hạn tốc độ
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 yêu cầu mỗi IP trong 15 phút
  message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
});
app.use(limiter);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Swagger setup
const swaggerDocument = require("../docs/openapiSpec.json");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use("/", indexRouter);
// app.use('/users', usersRouter); // Bỏ comment nếu cần sử dụng route users

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
