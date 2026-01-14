const ChemicalReactionService = require("../service/chemicalReactionService");
const JSend = require("../jsend");
class ChemicalReactionController {
  static async getAllChemicalReactions(req, res) {
    try {
      const response = await ChemicalReactionService.getAllChemicalReactions();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getChemicalReactionById(req, res) {
    try {
      const response = await ChemicalReactionService.getChemicalReactionById(
        req.params.reactionId
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createChemicalReaction(req, res) {
    try {
      const response = await ChemicalReactionService.createChemicalReaction(
        req.body
      );
      res.status(201).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }
  static async updateReaction(req, res, next) {
    try {
      console.log("Controller updateReaction called with id:", req.params.id);
      const reactionId = parseInt(req.params.id);
      const reactionData = req.body;
      const result = await ChemicalReactionService.updateReaction(
        reactionId,
        reactionData
      );
      return res.json(JSend.success(result));
    } catch (error) {
      console.error("Controller updateReaction error:", error);
      if (error.message === "Reaction not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }

  static async deleteReaction(req, res, next) {
    try {
      console.log("Controller deleteReaction called with id:", req.params.id);
      const reactionId = parseInt(req.params.id);
      const result = await ChemicalReactionService.deleteReaction(reactionId);
      return res.json(JSend.success(result));
    } catch (error) {
      console.error("Controller deleteReaction error:", error);
      if (error.message === "Reaction not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }
}

module.exports = ChemicalReactionController;
