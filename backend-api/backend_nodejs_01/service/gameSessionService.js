const GameSessionDao = require("../dao/gameSessionDao");

class GameSessionService {
  static async getAllGameSessions() {
    try {
      const sessions = await GameSessionDao.getAllGameSessions();
      return {
        code: 200,
        message: "Lấy danh sách phiên chơi thành công",
        result: sessions,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }
  static async getTopPlayers() {
    try {
      const topPlayers = await GameSessionDao.getTopPlayers();
      return topPlayers.map((player) => ({
        ...player,
        game_name: player.game_name || "Thám Tử Công Thức",
        username: player.username || `Người chơi ${player.user_id}`,
      }));
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }

  static async getGameSessionById(sessionId) {
    try {
      const session = await GameSessionDao.getGameSessionById(sessionId);
      if (!session) {
        throw {
          code: 404,
          message: "Không tìm thấy phiên chơi",
          error: "Session not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin phiên chơi thành công",
        result: session,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createGameSession(session) {
    try {
      const sessionId = await GameSessionDao.createGameSession(session);
      return {
        code: 201,
        message: "Tạo phiên chơi thành công",
        result: { session_id: sessionId },
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async updateSession(sessionId, sessionData) {
    console.log(
      "Service updateSession called with id:",
      sessionId,
      "data:",
      sessionData
    );
    if (!sessionId || isNaN(parseInt(sessionId))) {
      throw new Error("Invalid session ID");
    }
    if (
      sessionData.game_data &&
      typeof sessionData.game_data === "string" &&
      sessionData.game_data !== ""
    ) {
      try {
        JSON.parse(sessionData.game_data); // Kiểm tra JSON hợp lệ
      } catch {
        throw new Error("Invalid JSON format for game_data");
      }
    }
    const updatedSessionId = await GameSessionDao.updateSession(
      sessionId,
      sessionData
    );
    if (updatedSessionId.length === 0) {
      throw new Error("Session not found");
    }
    return { session_id: parseInt(updatedSessionId[0]) };
  }

  static async deleteSession(sessionId) {
    console.log("Service deleteSession called with id:", sessionId);
    if (!sessionId || isNaN(parseInt(sessionId))) {
      throw new Error("Invalid session ID");
    }
    const deletedSessionId = await GameSessionDao.deleteSession(sessionId);
    if (deletedSessionId.length === 0) {
      throw new Error("Session not found");
    }
    return { message: `Session with ID ${sessionId} deleted successfully` };
  }
}

module.exports = GameSessionService;
