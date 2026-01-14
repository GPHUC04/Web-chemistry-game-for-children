const CrosswordPuzzleDao = require("../dao/crosswordPuzzleDao");

class CrosswordPuzzleService {
  static async getAllCrosswordPuzzles() {
    try {
      const puzzles = await CrosswordPuzzleDao.getAllCrosswordPuzzles();
      return {
        code: 200,
        message: "Lấy danh sách ô chữ thành công",
        result: puzzles,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getCrosswordPuzzleById(puzzleId) {
    try {
      const puzzle = await CrosswordPuzzleDao.getCrosswordPuzzleById(puzzleId);
      if (!puzzle) {
        throw {
          code: 404,
          message: "Không tìm thấy ô chữ",
          error: "Puzzle not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin ô chữ thành công",
        result: puzzle,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createCrosswordPuzzle(puzzle) {
    try {
      const puzzleId = await CrosswordPuzzleDao.createCrosswordPuzzle(puzzle);
      return {
        code: 201,
        message: "Tạo ô chữ thành công",
        result: { puzzle_id: puzzleId },
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }
  static async updateCrosswordPuzzle(id, puzzleData) {
    console.log(
      "Service updateCrosswordPuzzle called with id:",
      id,
      "data:",
      puzzleData
    );
    if (!id || isNaN(parseInt(id))) {
      throw new Error("Invalid puzzle ID");
    }
    const jsonFields = ["grid_data", "clues_across", "clues_down", "solution"];
    for (const field of jsonFields) {
      console.log(`Validating ${field}:`, puzzleData[field]);
      if (
        puzzleData[field] &&
        typeof puzzleData[field] === "string" &&
        puzzleData[field] !== ""
      ) {
        try {
          JSON.parse(puzzleData[field]);
        } catch {
          throw new Error(`Invalid JSON format for ${field}`);
        }
      }
    }
    const updatedPuzzleId = await CrosswordPuzzleDao.updateCrosswordPuzzle(
      id,
      puzzleData
    );
    if (!updatedPuzzleId) {
      throw new Error("Crossword puzzle not found");
    }
    return { puzzle_id: parseInt(updatedPuzzleId) };
  }

  static async deleteCrosswordPuzzle(id) {
    console.log("Service deleteCrosswordPuzzle called with id:", id);
    if (!id || isNaN(parseInt(id))) {
      throw new Error("Invalid puzzle ID");
    }
    const deletedPuzzleId = await CrosswordPuzzleDao.deleteCrosswordPuzzle(id);
    if (!deletedPuzzleId) {
      throw new Error("Crossword puzzle not found");
    }
    return { message: `Crossword puzzle with ID ${id} deleted successfully` };
  }
}

module.exports = CrosswordPuzzleService;
