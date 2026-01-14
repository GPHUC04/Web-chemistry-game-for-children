const db = require("../database/connection");

class ChemicalReactionDao {
  static async getAllChemicalReactions() {
    return db("chemical_reactions").select("*");
  }

  static async getChemicalReactionById(reactionId) {
    if (!reactionId) {
      throw new Error("Invalid reactionId format");
    }
    const reaction = await db("chemical_reactions")
      .where({ reaction_id: reactionId })
      .first();
    return reaction;
  }

  static async createChemicalReaction(reaction) {
    try {
      // Validate required fields
      if (!reaction.equation) {
        const error = new Error("Phương trình phản ứng là bắt buộc");
        error.code = 400;
        throw error;
      }

      // Validate reaction_type
      const validReactionTypes = [
        "synthesis",
        "decomposition",
        "single_replacement",
        "double_replacement",
        "combustion",
        "acid_base",
        "redox",
        "precipitation",
      ];
      if (
        reaction.reaction_type &&
        !validReactionTypes.includes(reaction.reaction_type)
      ) {
        const error = new Error("Loại phản ứng không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Validate difficulty_level
      const validDifficultyLevels = ["easy", "medium", "hard", "expert"];
      if (
        reaction.difficulty_level &&
        !validDifficultyLevels.includes(reaction.difficulty_level)
      ) {
        const error = new Error("Mức độ khó không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Insert new chemical reaction
      const [result] = await db("chemical_reactions")
        .insert({
          equation: reaction.equation,
          reactants: reaction.reactants
            ? JSON.stringify(reaction.reactants)
            : null,
          products: reaction.products
            ? JSON.stringify(reaction.products)
            : null,
          reaction_type: reaction.reaction_type || null,
          conditions: reaction.conditions || null,
          description_vi: reaction.description_vi || null,
          description_en: reaction.description_en || null,
          difficulty_level: reaction.difficulty_level || null,
          is_balanced:
            reaction.is_balanced !== undefined ? reaction.is_balanced : true,
          energy_change: reaction.energy_change || null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("reaction_id");

      // Handle different return types from different databases
      return typeof result === "object" ? result.reaction_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi tạo phản ứng hóa học: ${error.message}`);
    }
  }
  static async updateReaction(reactionId, reactionData) {
    try {
      console.log("DAO updateReaction called with id:", reactionId);
      const reactionExists = await db("chemical_reactions")
        .where("reaction_id", reactionId)
        .first();
      if (!reactionExists) {
        return [];
      }

      const updated = await db("chemical_reactions")
        .where("reaction_id", reactionId)
        .update({
          ...reactionData,
          updated_at: db.fn.now(),
        })
        .returning("reaction_id");
      console.log("Updated reaction:", updated);
      return updated;
    } catch (error) {
      console.error("DAO updateReaction error:", error);
      throw error;
    }
  }

  static async deleteReaction(reactionId) {
    try {
      console.log("DAO deleteReaction called with id:", reactionId);
      return await db("chemical_reactions")
        .where("reaction_id", reactionId)
        .del()
        .returning("reaction_id");
    } catch (error) {
      console.error("DAO deleteReaction error:", error);
      throw error;
    }
  }
}

module.exports = ChemicalReactionDao;
