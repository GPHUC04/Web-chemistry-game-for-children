const CompoundDao = require("../dao/compoundDao");

class CompoundService {
  static async getAllCompounds() {
    try {
      const compounds = await CompoundDao.getAllCompounds();
      return {
        code: 200,
        message: "Lấy danh sách hợp chất thành công",
        result: compounds,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getCompoundById(compoundId) {
    try {
      const compound = await CompoundDao.getCompoundById(compoundId);
      if (!compound) {
        throw {
          code: 404,
          message: "Không tìm thấy hợp chất",
          error: "Compound not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin hợp chất thành công",
        result: compound,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }
  static async createCompound(compoundData) {
    try {
      // Validate required fields
      if (
        !compoundData.formula ||
        !compoundData.name_vi ||
        !compoundData.name_en
      ) {
        const error = new Error(
          "Công thức, tên tiếng Việt và tên tiếng Anh là bắt buộc"
        );
        error.code = 400;
        throw error;
      }

      // Validate compound_type
      const validCompoundTypes = [
        "ionic",
        "covalent",
        "metallic",
        "acid",
        "base",
        "salt",
        "organic",
        "inorganic",
      ];
      if (
        compoundData.compound_type &&
        !validCompoundTypes.includes(compoundData.compound_type)
      ) {
        const error = new Error("Loại hợp chất không hợp lệ");
        error.code = 400;
        throw error;
      }

      // Validate difficulty_level
      const validDifficultyLevels = ["easy", "medium", "hard", "expert"];
      if (
        compoundData.difficulty_level &&
        !validDifficultyLevels.includes(compoundData.difficulty_level)
      ) {
        const error = new Error("Mức độ khó không hợp lệ");
        error.code = 400;
        throw error;
      }

      const compoundId = await CompoundDao.createCompound(compoundData);

      return {
        code: 201,
        message: "Tạo hợp chất thành công",
        result: {
          compound_id: compoundId,
        },
      };
    } catch (error) {
      throw {
        code: error.code || 500,
        message: error.message || "Lỗi khi tạo hợp chất",
      };
    }
  }

  static async updateCompound(compoundId, compoundData) {
    console.log("Service updateCompound called with id:", compoundId);
    if (!compoundId || isNaN(parseInt(compoundId))) {
      throw new Error("Invalid compound ID");
    }

    const updatedCompoundId = await CompoundDao.updateCompound(
      compoundId,
      compoundData
    );
    if (updatedCompoundId.length === 0) {
      throw new Error("Compound not found");
    }

    return { compound_id: updatedCompoundId[0] };
  }

  static async deleteCompound(compoundId) {
    console.log("Service deleteCompound called with id:", compoundId);
    if (!compoundId || isNaN(parseInt(compoundId))) {
      throw new Error("Invalid compound ID");
    }

    const deletedCompoundId = await CompoundDao.deleteCompound(compoundId);
    if (deletedCompoundId.length === 0) {
      throw new Error("Compound not found");
    }

    return { message: `Compound with ID ${compoundId} deleted successfully` };
  }
}

module.exports = CompoundService;
