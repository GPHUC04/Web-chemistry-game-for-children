const db = require("../database/connection");

class GameDao {
  static async getAllGames() {
    return db("games").select("*");
  }

  static async getGameById(gameId) {
    if (!gameId) {
      throw new Error("Invalid gameId format");
    }
    const game = await db("games").where({ game_id: gameId }).first();
    return game;
  }

  static async createGame(game) {
    try {
      // Validate required fields
      if (!game.game_code || !game.name_vi || !game.name_en) {
        const error = new Error(
          "Mã trò chơi, tên tiếng Việt và tên tiếng Anh là bắt buộc"
        );
        error.code = 400;
        throw error;
      }

      // Validate category
      const validCategories = [
        "reaction_game",
        "periodic_table",
        "lab_simulation",
        "puzzle_knowledge",
      ];
      if (game.category && !validCategories.includes(game.category)) {
        const error = new Error("Danh mục trò chơi không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Check if game_code already exists
      const existing = await db("games")
        .where({ game_code: game.game_code })
        .first();

      if (existing) {
        const error = new Error(`Mã trò chơi '${game.game_code}' đã tồn tại`);
        error.code = 400;
        throw error;
      }

      // Insert new game
      const [result] = await db("games")
        .insert({
          game_code: game.game_code,
          name_vi: game.name_vi,
          name_en: game.name_en,
          description_vi: game.description_vi || null,
          description_en: game.description_en || null,
          category: game.category || null,
          max_score: game.max_score || 1000,
          time_limit: game.time_limit || 300,
          is_active: game.is_active !== undefined ? game.is_active : true,
          game_settings: game.game_settings
            ? JSON.stringify(game.game_settings)
            : null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("game_id");

      // Handle different return types from different databases
      return typeof result === "object" ? result.game_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi tạo trò chơi: ${error.message}`);
    }
  }

  static async updateGame(gameId, gameData) {
    try {
      console.log("DAO updateGame called with id:", gameId);
      const gameExists = await db("games").where("game_id", gameId).first();
      if (!gameExists) {
        return [];
      }
      const updated = await db("games")
        .where("game_id", gameId)
        .update({
          ...gameData,
          updated_at: db.fn.now(),
        })
        .returning("game_id");
      console.log("Updated game:", updated);
      return updated;
    } catch (error) {
      console.error("DAO updateGame error:", error);
      throw error;
    }
  }

  static async deleteGame(gameId) {
    try {
      console.log("DAO deleteGame called with id:", gameId);
      return await db("games")
        .where("game_id", gameId)
        .del()
        .returning("game_id");
    } catch (error) {
      console.error("DAO deleteGame error:", error);
      throw error;
    }
  }

  static async findGameById(game_id) {
    try {
      console.log(`findGameById - game_id: ${game_id}`); // Log để debug
      const game = await db("games").where({ game_id }).first();
      return game || null; // Trả về game hoặc null nếu không tìm thấy
    } catch (error) {
      console.error("Error in findGameById:", error);
      throw new Error(`Lỗi cơ sở dữ liệu khi tìm trò chơi: ${error.message}`);
    }
  }
}

module.exports = GameDao;
