const db = require("../database/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
class UserDao {
  static async getAllUsers() {
    return db("users").select("user_id", "username", "email");
  }

  static async getUserById(userId) {
    if (!userId) {
      throw new Error("Invalid userId format");
    }
    const user = await db("users")
      .select(
        "user_id",
        "username",
        "email",
        "date_of_birth",
        "school",
        "grade_level"
      )
      .where({ user_id: userId })
      .first();
    return user;
  }

  static async createUser(userData) {
    const {
      username,
      email,
      password,
      date_of_birth,
      school,
      grade_level,
      preferred_language,
    } = userData;

    try {
      const result = await db("users")
        .insert({
          username,
          email,
          password,
          date_of_birth: date_of_birth || null,
          school: school || null,
          grade_level: grade_level || null,
          preferred_language: preferred_language || "vi",
          updated_at: db.fn.now(),
        })
        .returning("user_id");

      const userId = result[0].user_id; // Lấy giá trị user_id từ object
      if (!userId || isNaN(userId)) {
        throw {
          code: 500,
          message: `Không thể lấy ID người dùng hợp lệ sau khi chèn. Kết quả: ${JSON.stringify(
            result
          )}`,
        };
      }

      const createdUser = await db("users")
        .where({ user_id: parseInt(userId, 10) })
        .first();
      if (!createdUser) {
        throw {
          code: 500,
          message: "Không thể tìm thấy người dùng sau khi chèn",
        };
      }

      return createdUser;
    } catch (error) {
      if (error.code === "22P02") {
        throw {
          code: 400,
          message: `Dữ liệu không hợp lệ. Kiểm tra user_id hoặc giá trị khác: ${error.message}`,
        };
      } else if (error.code === "23505") {
        throw { code: 409, message: "Email đã tồn tại" };
      }
      throw { code: 500, message: error.message || "Lỗi khi tạo người dùng" };
    }
  }

  static async findUserByEmail(email) {
    return await db("users").where({ email }).first();
  }

  // Thêm phương thức để kiểm tra (nếu cần)
  static async findUserById(userId) {
    return await db("users")
      .where({ user_id: parseInt(userId) })
      .first(); // Đảm bảo parseInt
  }

  static async updateUser(userId, userData) {
    const {
      username,
      email,
      password,
      date_of_birth,
      school,
      grade_level,
      total_score,
      total_games_played,
      level,
      experience_points,
      last_login,
      is_active,
      preferred_language,
    } = userData;

    // Kiểm tra xem user có tồn tại không
    const userExists = await db("users").where("user_id", userId).first();

    if (!userExists) {
      return null; // hoặc throw new Error("User not found");
    }

    // Nếu tồn tại thì tiến hành cập nhật
    const updated = await db("users")
      .where("user_id", userId)
      .update({
        username,
        email,
        password,
        date_of_birth,
        school,
        grade_level,
        total_score,
        total_games_played,
        level,
        experience_points,
        last_login,
        is_active,
        preferred_language,
        updated_at: db.fn.now(),
      })
      .returning("user_id");

    return updated;
  }

  static async deleteUser(userId) {
    return db("users").where("user_id", userId).del().returning("user_id");
  }
}

module.exports = UserDao;
