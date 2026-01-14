const db = require("../database/connection");

class GameSessionDao {
  static async getAllGameSessions() {
    try {
      return await db("game_sessions")
        .select(
          "game_sessions.session_id",
          "game_sessions.user_id",
          "users.username",
          "game_sessions.game_id",
          "games.name_vi as game_name",
          "game_sessions.score",
          "game_sessions.time_spent",
          "game_sessions.difficulty",
          "game_sessions.status",
          "game_sessions.started_at",
          "game_sessions.created_at"
        )
        .leftJoin("users", "game_sessions.user_id", "users.user_id")
        .leftJoin("games", "game_sessions.game_id", "games.game_id")
        .where("game_sessions.status", "completed")
        .orderBy("game_sessions.score", "desc");
    } catch (error) {
      console.error("Error fetching game sessions:", error);
      throw new Error("Could not fetch game sessions");
    }
  }
  static async getTopPlayers() {
    try {
      return await db("game_sessions")
        .select(
          "games.game_id",
          "games.name_vi as game_name",
          "users.username",
          "game_sessions.score as top_score"
        )
        .leftJoin("users", "game_sessions.user_id", "users.user_id")
        .leftJoin("games", "game_sessions.game_id", "games.game_id")
        .where("game_sessions.status", "completed")
        .whereIn(
          ["game_sessions.session_id"],
          db("game_sessions")
            .select(db.raw("MIN(game_sessions.session_id)"))
            .where("game_sessions.status", "completed")
            .groupBy("game_sessions.game_id")
            .havingRaw(
              "MAX(game_sessions.score) = (SELECT MAX(score) FROM game_sessions gs WHERE gs.game_id = game_sessions.game_id AND gs.status = 'completed')"
            )
        )
        .orderBy("game_sessions.score", "desc")
        .orderBy("game_sessions.created_at", "asc");
    } catch (error) {
      console.error("Error fetching top players in DAO:", error);
      throw new Error("Could not fetch top players");
    }
  }

  static async getGameSessionById(sessionId) {
    if (!sessionId) {
      throw new Error("Invalid sessionId format");
    }
    const session = await db("game_sessions")
      .where({ session_id: sessionId })
      .first();
    return session;
  }

  static async createGameSession(session) {
    try {
      // Validate required fields
      if (!session.user_id || !session.game_id) {
        const error = new Error("ID người dùng và ID trò chơi là bắt buộc");
        error.code = 400;
        throw error;
      }

      // Validate difficulty
      const validDifficulties = ["easy", "medium", "hard", "expert"];
      if (
        session.difficulty &&
        !validDifficulties.includes(session.difficulty)
      ) {
        const error = new Error("Mức độ khó không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Validate status
      const validStatuses = ["playing", "completed", "abandoned"];
      if (session.status && !validStatuses.includes(session.status)) {
        const error = new Error("Trạng thái phiên chơi không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Check if user_id exists
      const userExists = await db("users")
        .where({ user_id: session.user_id })
        .first();
      if (!userExists) {
        const error = new Error(
          `Người dùng với ID '${session.user_id}' không tồn tại`
        );
        error.code = 400;
        throw error;
      }

      // Check if game_id exists
      const gameExists = await db("games")
        .where({ game_id: session.game_id })
        .first();
      if (!gameExists) {
        const error = new Error(
          `Trò chơi với ID '${session.game_id}' không tồn tại`
        );
        error.code = 400;
        throw error;
      }

      // Insert new game session
      const [result] = await db("game_sessions")
        .insert({
          user_id: session.user_id,
          game_id: session.game_id,
          score: session.score || 0,
          time_spent: session.time_spent || null,
          difficulty: session.difficulty || null,
          status: session.status || "playing",
          game_data: session.game_data
            ? JSON.stringify(session.game_data)
            : null,
          started_at: session.started_at || new Date(),
          completed_at: session.completed_at || null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("session_id");

      // Handle different return types from different databases
      return typeof result === "object" ? result.session_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi tạo phiên chơi: ${error.message}`);
    }
  }
  static async updateSession(sessionId, sessionData) {
    try {
      console.log("DAO updateSession called with id:", sessionId);
      const sessionExists = await db("game_sessions")
        .where("session_id", sessionId)
        .first();
      if (!sessionExists) {
        return [];
      }
      const updated = await db("game_sessions")
        .where("session_id", sessionId)
        .update({
          ...sessionData,
          updated_at: db.fn.now(),
        })
        .returning("session_id");
      console.log("Updated session:", updated);
      return updated;
    } catch (error) {
      console.error("DAO updateSession error:", error);
      throw error;
    }
  }

  static async deleteSession(sessionId) {
    try {
      console.log("DAO deleteSession called with id:", sessionId);
      return await db("game_sessions")
        .where("session_id", sessionId)
        .del()
        .returning("session_id");
    } catch (error) {
      console.error("DAO deleteSession error:", error);
      throw error;
    }
  }
}

module.exports = GameSessionDao;
