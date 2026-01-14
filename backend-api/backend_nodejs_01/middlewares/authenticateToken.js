const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Lấy token từ header Authorization
  const token = req.headers["authorization"];

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).send("No token provided");
  }

  // Giả định token được gửi dưới dạng "Bearer <token>", tách token ra
  const tokenValue = token.split(" ")[1]; // Lấy phần sau "Bearer"
  if (!tokenValue) {
    return res.status(401).send("Invalid token format");
  }

  // Xác thực token
  jwt.verify(
    tokenValue,
    process.env.SECRET_KEY || "your-secret-key",
    (err, decoded) => {
      if (err) {
        return res.status(403).send("Token không hợp lệ hoặc đã hết hạn");
      }
      // Lưu thông tin người dùng đã giải mã vào request để sử dụng ở route
      req.user = decoded;
      next();
    }
  );
};

module.exports = authenticateToken;
