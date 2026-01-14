const GameService = require("../service/gameService");

class GameController {
  static async getAllGames(req, res) {
    try {
      const response = await GameService.getAllGames();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getGameById(req, res) {
    try {
      const response = await GameService.getGameById(req.params.gameId);
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createGame(req, res) {
    try {
      const response = await GameService.createGame(req.body);
      res.status(201).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async updateGame(req, res, next) {
    try {
      console.log(
        "Controller updateGame called with id:",
        req.params.id,
        "data:",
        req.body
      );
      const gameId = req.params.id;
      const gameData = req.body;
      const result = await GameService.updateGame(gameId, gameData);
      return res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      console.error("Controller updateGame error:", error);
      if (error.message === "Game not found") {
        return next({ status: 404, message: "Không tìm thấy trò chơi" });
      }
      return next({ status: 400, message: error.message });
    }
  }

  static async deleteGame(req, res, next) {
    try {
      console.log("Controller deleteGame called with id:", req.params.id);
      const gameId = req.params.id;
      const result = await GameService.deleteGame(gameId);
      return res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      console.error("Controller deleteGame error:", error);
      if (error.message === "Game not found") {
        return next({ status: 404, message: "Không tìm thấy trò chơi" });
      }
      return next({ status: 400, message: error.message });
    }
  }
}

module.exports = GameController;
