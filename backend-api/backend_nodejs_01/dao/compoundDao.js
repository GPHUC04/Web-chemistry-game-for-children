const db = require("../database/connection");
const Knex = require("knex");
const config = require("../database/knexfile");
const knex = Knex(config.development);
class CompoundDao {
  static async getAllCompounds() {
    return db("compounds").select("*");
  }

  static async getCompoundById(compoundId) {
    const compound = await db("compounds")
      .where({ compound_id: compoundId })
      .first();
    return compound;
  }

  static async createCompound(compound) {
    try {
      // Kiểm tra formula đã tồn tại chưa
      const existing = await db("compounds")
        .where({ formula: compound.formula })
        .first();

      if (existing) {
        const error = new Error(`Công thức '${compound.formula}' đã tồn tại.`);
        error.code = 400;
        throw error;
      }

      // Thêm mới hợp chất
      const [result] = await db("compounds")
        .insert({
          formula: compound.formula,
          name_vi: compound.name_vi,
          name_en: compound.name_en,
          molecular_mass: compound.molecular_mass || null,
          structure_info: compound.structure_info || null,
          properties: compound.properties
            ? JSON.stringify(compound.properties)
            : null,
          uses: compound.uses || null,
          compound_type: compound.compound_type || null,
          difficulty_level: compound.difficulty_level || null,
          image_url: compound.image_url || null,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("compound_id");

      // Handle different return types from different databases
      return typeof result === "object" ? result.compound_id : result;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new Error(`Lỗi khi tạo hợp chất: ${error.message}`);
    }
  }
  static async updateCompound(compoundId, compoundData) {
    try {
      console.log("DAO updateCompound called with id:", compoundId);
      const compoundExists = await db("compounds")
        .where("compound_id", compoundId)
        .first();
      if (!compoundExists) {
        return [];
      }

      const updated = await db("compounds")
        .where("compound_id", compoundId)
        .update({
          ...compoundData,
          updated_at: db.fn.now(),
        })
        .returning("compound_id");
      console.log("Updated compound:", updated);
      return updated;
    } catch (error) {
      console.error("DAO updateCompound error:", error);
      throw error;
    }
  }

  static async deleteCompound(compoundId) {
    try {
      console.log("DAO deleteCompound called with id:", compoundId);
      return await db("compounds")
        .where("compound_id", compoundId)
        .del()
        .returning("compound_id");
    } catch (error) {
      console.error("DAO deleteCompound error:", error);
      throw error;
    }
  }
}

module.exports = CompoundDao;
