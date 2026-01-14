const GameSessionService = require("../service/gameSessionService");
const ApiError = require("../api-error");
class GameSessionController {
  static async getAllGameSessions(req, res) {
    try {
      const response = await GameSessionService.getAllGameSessions();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getGameSessionById(req, res) {
    try {
      const response = await GameSessionService.getGameSessionById(
        req.params.sessionId
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createGameSession(req, res) {
    try {
      const response = await GameSessionService.createGameSession(req.body);
      res.status(201).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }
  // gameSessionController.js
  static async updateSession(req, res) {
    try {
      console.log("req.body:", req.body); // In dữ liệu để kiểm tra
      const sessionId = parseInt(req.params.id, 10); // Dòng này có thể là dòng 36 hoặc gần đó
      const sessionDto = req.body;
      const response =
        await require("../service/gameSessionService").updateSession(
          sessionId,
          sessionDto
        );
      res.status(200).json(response);
    } catch (err) {
      console.error("Error in updateSession:", err);
      const statusCode =
        err.code === 400 || err.code === 401 || err.code === 404
          ? err.code
          : 500;
      res.status(statusCode).json({
        status: "error",
        message: err.message || "Lỗi server không xác định",
      });
    }
  }

  static async deleteSession(req, res, next) {
    try {
      console.log(
        "Controller deleteSession called with id:",
        req.validatedData.id
      );
      const result = await GameSessionService.deleteSession(
        req.validatedData.id
      );
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      console.error("Controller deleteSession error:", error);
      return next(
        error.message === "Session not found"
          ? new ApiError(404, "Không tìm thấy phiên chơi")
          : new ApiError(500, error.message || "Lỗi server khi xóa phiên chơi")
      );
    }
  }
  static async getTopPlayers(req, res) {
    try {
      const topPlayers = await GameSessionService.getTopPlayers();
      res.json(topPlayers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GameSessionController;
