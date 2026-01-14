const UserDao = require("../dao/UserDao");
const bcrypt = require("bcryptjs");
const config = require("../../backend_nodejs_01/config");
const jwt = require("jsonwebtoken");
class UserService {
  static async getAllUsers() {
    try {
      const users = await UserDao.getAllUsers();
      return {
        code: 200,
        message: "Lấy danh sách người dùng thành công",
        result: users,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getUserById(userId) {
    try {
      const user = await UserDao.getUserById(userId);
      if (!user) {
        throw {
          code: 404,
          message: "Không tìm thấy người dùng",
          error: "User not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin người dùng thành công",
        result: user,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createUser(userDto) {
    const {
      email,
      password,
      confirmPassword,
      date_of_birth,
      school,
      grade_level,
      preferred_language,
    } = userDto;

    // Validate input
    if (!email || !password || !confirmPassword) {
      throw { code: 400, message: "Email và mật khẩu là bắt buộc" };
    }
    if (password !== confirmPassword) {
      throw { code: 422, message: "Mật khẩu và xác nhận mật khẩu không khớp" };
    }
    if (
      grade_level &&
      !["6", "7", "8", "9", "10", "11", "12", "university", "other"].includes(
        grade_level
      )
    ) {
      throw { code: 400, message: "grade_level không hợp lệ" };
    }
    if (date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
      throw {
        code: 400,
        message: "date_of_birth phải đúng định dạng YYYY-MM-DD",
      };
    }
    if (preferred_language && !["vi", "en"].includes(preferred_language)) {
      throw { code: 400, message: "preferred_language phải là vi hoặc en" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email exists
    const existingUser = await UserDao.findUserByEmail(email);
    if (existingUser) {
      throw { code: 409, message: "Email đã tồn tại" };
    }

    // Tạo username tạm thời
    const username = `${email.split("@")[0]}_${Date.now()}`
      .toLowerCase()
      .substring(0, 50);

    const userData = {
      username,
      email,
      password: hashedPassword,
      date_of_birth,
      school,
      grade_level,
      preferred_language: preferred_language || "vi",
    };

    try {
      const result = await UserDao.createUser(userData);
      const { password, ...userWithoutPassword } = result;
      return {
        code: 201,
        message: "Đăng ký thành công",
        result: userWithoutPassword,
      };
    } catch (error) {
      throw {
        code: error.code || 500,
        message: error.message || "Lỗi khi tạo người dùng",
      };
    }
  }
  static async loginUser(loginDto) {
    const { email, password } = loginDto;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      throw { code: 400, message: "Email và mật khẩu không được để trống" };
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw { code: 400, message: "Email không hợp lệ" };
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserDao.findUserByEmail(email);
    if (!user) {
      throw { code: 401, message: "Email hoặc mật khẩu không đúng" };
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { code: 401, message: "Email hoặc mật khẩu không đúng" };
    }

    // Tạo token JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      config.jwtSecret, // Chuỗi bí mật để ký token, ví dụ: 'mysecretkey'
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    // Loại bỏ mật khẩu khỏi dữ liệu trả về
    const { password: _, ...userWithoutPassword } = user;

    // Trả về kết quả thành công
    return {
      code: 200,
      message: "Đăng nhập thành công",
      result: {
        user: userWithoutPassword,
        token,
      },
    };
  }

  static async updateUser(userId, userData) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error("Invalid user ID");
    }
    const updatedUserId = await UserDao.updateUser(userId, userData);
    return { user_id: updatedUserId[0] };
  }

  static async deleteUser(userId) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error("Invalid user ID");
    }
    const deletedUserId = await UserDao.deleteUser(userId);
    if (deletedUserId.length === 0) {
      throw new Error("User not found");
    }
    return { message: `User with ID ${userId} deleted successfully` };
  }
}

module.exports = UserService;
