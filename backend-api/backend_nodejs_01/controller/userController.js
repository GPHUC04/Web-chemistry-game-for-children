const UsersService = require("../service/userService");
const JSend = require("../jsend");
class UsersController {
  static async getAllUsers(req, res) {
    try {
      const response = await UsersService.getAllUsers();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getUsersById(req, res) {
    try {
      const response = await UsersService.getUserById(req.params.userId);
      res.status(response.code).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createUsers(req, res) {
    try {
      const userDto = req.body;
      const response = await require("../service/userService").createUser(
        userDto
      );
      res.status(201).json(response);
    } catch (err) {
      console.error("Error in createUser:", err);
      let statusCode = 500;
      if (err.code === "22P02" || err.code === 400) {
        statusCode = 400;
      } else if (err.code === "23505" || err.code === 409) {
        statusCode = 409;
      } else if (err.code === 422) {
        statusCode = 422;
      }
      res.status(statusCode).json({
        code: err.code || 500,
        message: err.message || "Lỗi server không xác định",
      });
    }
  }

  static async loginUser(req, res) {
    try {
      const loginDto = req.body; // Lấy dữ liệu từ body của request
      const response = await require("../service/userService").loginUser(
        loginDto
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json({
        code: err.code || 500,
        message: err.message || "Lỗi server không xác định",
      });
    }
  }

  static async updateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body;
      const result = await UsersService.updateUser(userId, userData);
      return res.json(JSend.success(result));
    } catch (error) {
      return next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const result = await UsersService.deleteUser(userId);
      return res.json(JSend.success(result));
    } catch (error) {
      if (error.message === "User not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }
}

module.exports = UsersController;
