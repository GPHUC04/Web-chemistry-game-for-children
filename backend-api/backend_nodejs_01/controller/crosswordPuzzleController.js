const CrosswordPuzzleService = require("../service/crosswordPuzzleService");

class CrosswordPuzzleController {
  static async getAllCrosswordPuzzles(req, res) {
    try {
      const response = await CrosswordPuzzleService.getAllCrosswordPuzzles();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getCrosswordPuzzleById(req, res) {
    try {
      const response = await CrosswordPuzzleService.getCrosswordPuzzleById(
        req.params.puzzleId
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createCrosswordPuzzle(req, res) {
    try {
      const response = await CrosswordPuzzleService.createCrosswordPuzzle(
        req.body
      );
      res.status(201).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }
  static async updateCrosswordPuzzle(req, res, next) {
    try {
      const puzzle = await CrosswordPuzzleService.updateCrosswordPuzzle(
        req.validatedData.id,
        req.validatedData
      );
      return res.status(200).json({
        status: "success",
        data: puzzle,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCrosswordPuzzle(req, res, next) {
    try {
      const result = await CrosswordPuzzleService.deleteCrosswordPuzzle(
        req.validatedData.id
      );
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CrosswordPuzzleController;
