const GameDao = require("../dao/gameDao");

class GameService {
  static async getAllGames() {
    try {
      const games = await GameDao.getAllGames();
      return {
        code: 200,
        message: "Lấy danh sách trò chơi thành công",
        result: games,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getGameById(gameId) {
    try {
      const game = await GameDao.getGameById(gameId);
      if (!game) {
        throw {
          code: 404,
          message: "Không tìm thấy trò chơi",
          error: "Game not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin trò chơi thành công",
        result: game,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createGame(game) {
    try {
      const gameId = await GameDao.createGame(game);
      return {
        code: 201,
        message: "Tạo trò chơi thành công",
        result: { game_id: gameId },
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async updateGame(gameId, gameData) {
    console.log("Service updateGame called with id:", gameId);
    if (!gameId || isNaN(parseInt(gameId))) {
      throw new Error("Invalid game ID");
    }
    if (gameData.game_settings) {
      try {
        JSON.parse(gameData.game_settings);
      } catch {
        throw new Error("Invalid JSON format for game_settings");
      }
    }
    const updatedGameId = await GameDao.updateGame(gameId, gameData);
    if (updatedGameId.length === 0) {
      throw new Error("Game not found");
    }
    return { game_id: parseInt(updatedGameId[0]) };
  }

  static async deleteGame(gameId) {
    console.log("Service deleteGame called with id:", gameId);
    if (!gameId || isNaN(parseInt(gameId))) {
      throw new Error("Invalid game ID");
    }
    const deletedGameId = await GameDao.deleteGame(gameId);
    if (deletedGameId.length === 0) {
      throw new Error("Game not found");
    }
    return { message: `Game with ID ${gameId} deleted successfully` };
  }
}

module.exports = GameService;
