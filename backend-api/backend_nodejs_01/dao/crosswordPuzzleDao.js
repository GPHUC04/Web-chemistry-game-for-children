const db = require("../database/connection");

class CrosswordPuzzleDao {
  static async getAllCrosswordPuzzles() {
    return db("crossword_puzzles").select("*");
  }

  static async getCrosswordPuzzleById(puzzleId) {
    if (!puzzleId) {
      throw new Error("Invalid puzzleId format");
    }
    const puzzle = await db("crossword_puzzles")
      .where({ puzzle_id: puzzleId })
      .first();
    return puzzle;
  }

  static async createCrosswordPuzzle(puzzle) {
    try {
      const [puzzleId] = await db("crossword_puzzles")
        .insert({
          created_by: puzzle.created_by || null,
          title_vi: puzzle.title_vi,
          title_en: puzzle.title_en,
          grid_data: JSON.stringify(puzzle.grid_data),
          clues_across: JSON.stringify(puzzle.clues_across),
          clues_down: JSON.stringify(puzzle.clues_down),
          solution: JSON.stringify(puzzle.solution),
          difficulty_level: puzzle.difficulty_level || "medium",
          grid_size: puzzle.grid_size || 15,
          is_public: puzzle.is_public ?? true,
          is_approved: puzzle.is_approved ?? false,
          times_played: 0,
          average_rating: null,
        })
        .returning("puzzle_id");

      return puzzleId;
    } catch (error) {
      throw new Error(`Error creating crossword puzzle: ${error.message}`);
    }
  }
  static async updateCrosswordPuzzle(id, puzzle) {
    try {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        const error = new Error("ID ô chữ không hợp lệ");
        error.code = 400;
        throw error;
      }

      const existingPuzzle = await db("crossword_puzzles")
        .where("puzzle_id", id)
        .first();
      if (!existingPuzzle) {
        const error = new Error("Không tìm thấy ô chữ");
        error.code = 404;
        throw error;
      }

      // Kiểm tra foreign key nếu có
      if (puzzle.created_by) {
        const userExists = await db("users")
          .where("user_id", puzzle.created_by)
          .first();
        if (!userExists) {
          const error = new Error("Không tìm thấy user_id");
          error.code = 400;
          throw error;
        }
      }

      const updateData = {
        created_by:
          puzzle.created_by !== undefined
            ? puzzle.created_by
            : existingPuzzle.created_by,
        title_vi:
          puzzle.title_vi !== undefined
            ? puzzle.title_vi
            : existingPuzzle.title_vi,
        title_en:
          puzzle.title_en !== undefined
            ? puzzle.title_en
            : existingPuzzle.title_en,
        grid_data:
          puzzle.grid_data !== undefined
            ? puzzle.grid_data
              ? JSON.stringify(puzzle.grid_data)
              : null
            : existingPuzzle.grid_data,
        clues_across:
          puzzle.clues_across !== undefined
            ? puzzle.clues_across
              ? JSON.stringify(puzzle.clues_across)
              : null
            : existingPuzzle.clues_across,
        clues_down:
          puzzle.clues_down !== undefined
            ? puzzle.clues_down
              ? JSON.stringify(puzzle.clues_down)
              : null
            : existingPuzzle.clues_down,
        solution:
          puzzle.solution !== undefined
            ? puzzle.solution
              ? JSON.stringify(puzzle.solution)
              : null
            : existingPuzzle.solution,
        difficulty_level:
          puzzle.difficulty_level !== undefined
            ? puzzle.difficulty_level
            : existingPuzzle.difficulty_level,
        grid_size:
          puzzle.grid_size !== undefined
            ? puzzle.grid_size
            : existingPuzzle.grid_size,
        is_public:
          puzzle.is_public !== undefined
            ? puzzle.is_public
            : existingPuzzle.is_public,
        is_approved:
          puzzle.is_approved !== undefined
            ? puzzle.is_approved
            : existingPuzzle.is_approved,
        times_played:
          puzzle.times_played !== undefined
            ? puzzle.times_played
            : existingPuzzle.times_played,
        average_rating:
          puzzle.average_rating !== undefined
            ? puzzle.average_rating
            : existingPuzzle.average_rating,
      };

      const [result] = await db("crossword_puzzles")
        .where("puzzle_id", id)
        .update(updateData)
        .returning("puzzle_id");

      return typeof result === "object" ? result.puzzle_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi cập nhật ô chữ: ${error.message}`);
    }
  }

  static async deleteCrosswordPuzzle(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        const error = new Error("Invalid puzzle ID");
        error.code = 400;
        throw error;
      }

      const [result] = await db("crossword_puzzles")
        .where("puzzle_id", id)
        .del()
        .returning("puzzle_id");

      if (!result) {
        const error = new Error("Crossword puzzle not found");
        error.code = 404;
        throw error;
      }

      return typeof result === "object" ? result.puzzle_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi xóa ô chữ: ${error.message}`);
    }
  }
}

module.exports = CrosswordPuzzleDao;
