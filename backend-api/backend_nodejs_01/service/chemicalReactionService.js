const ChemicalReactionDao = require("../dao/chemicalReactionDao");

class ChemicalReactionService {
  static async getAllChemicalReactions() {
    try {
      const reactions = await ChemicalReactionDao.getAllChemicalReactions();
      return {
        code: 200,
        message: "Lấy danh sách phản ứng hóa học thành công",
        result: reactions,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getChemicalReactionById(reactionId) {
    try {
      const reaction = await ChemicalReactionDao.getChemicalReactionById(
        reactionId
      );
      if (!reaction) {
        throw {
          code: 404,
          message: "Không tìm thấy phản ứng hóa học",
          error: "Reaction not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin phản ứng hóa học thành công",
        result: reaction,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createChemicalReaction(reaction) {
    try {
      const reactionId = await ChemicalReactionDao.createChemicalReaction(
        reaction
      );
      return {
        code: 201,
        message: "Tạo phản ứng hóa học thành công",
        result: { reaction_id: reactionId },
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }
  static async updateReaction(reactionId, reactionData) {
    console.log("Service updateReaction called with id:", reactionId);
    if (!reactionId || isNaN(parseInt(reactionId))) {
      throw new Error("Invalid reaction ID");
    }

    const updatedReactionId = await ChemicalReactionDao.updateReaction(
      reactionId,
      reactionData
    );
    if (updatedReactionId.length === 0) {
      throw new Error("Reaction not found");
    }

    return { reaction_id: updatedReactionId[0] };
  }

  static async deleteReaction(reactionId) {
    console.log("Service deleteReaction called with id:", reactionId);
    if (!reactionId || isNaN(parseInt(reactionId))) {
      throw new Error("Invalid reaction ID");
    }

    const deletedReactionId = await ChemicalReactionDao.deleteReaction(
      reactionId
    );
    if (deletedReactionId.length === 0) {
      throw new Error("Reaction not found");
    }

    return { message: `Reaction with ID ${reactionId} deleted successfully` };
  }
}

module.exports = ChemicalReactionService;
