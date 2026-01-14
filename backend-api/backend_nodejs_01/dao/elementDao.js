const db = require("../database/connection");

class ElementDao {
  static async getAllElements() {
    return db("elements").select("*");
  }

  static async getElementById(elementId) {
    const element = await db("elements")
      .where({ element_id: elementId })
      .first();
    return element;
  }

  static async findBySymbolOrAtomicNumber(symbol, atomicNumber) {
    return db("elements")
      .where("symbol", symbol)
      .orWhere("atomic_number", atomicNumber)
      .first();
  }

  static async createElement(element) {
    try {
      const [elementId] = await db("elements")
        .insert({
          symbol: element.symbol,
          name_en: element.name_en,
          atomic_number: element.atomic_number,
          atomic_mass: element.atomic_mass,
          group_number: element.group_number || null,
          period_number: element.period_number || null,
          electron_configuration: element.electron_configuration || null,
          properties: element.properties
            ? JSON.stringify(element.properties)
            : null,
          applications: element.applications || null,
          color: element.color || null,
          category: element.category || null,
        })
        .returning("element_id");

      return elementId;
    } catch (err) {
      // Bắt lỗi unique constraint
      if (err.message.includes("duplicate key")) {
        throw {
          code: 400,
          message: `Nguyên tố có symbol hoặc atomic_number đã tồn tại.`,
        };
      }
      throw {
        code: 500,
        message: "Lỗi khi tạo nguyên tố: " + err.message,
      };
    }
  }

  static async updateElement(elementId, elementData) {
    const {
      symbol,
      name_en,
      atomic_number,
      atomic_mass,
      group_number,
      period_number,
      electron_configuration,
      properties,
      applications,
      color,
      category,
    } = elementData;

    // Kiểm tra element có tồn tại không
    const elementExists = await db("elements")
      .where("element_id", elementId)
      .first();
    if (!elementExists) {
      return [];
    }

    // Cập nhật element
    const updated = await db("elements")
      .where("element_id", elementId)
      .update({
        symbol,
        name_en,
        atomic_number,
        atomic_mass,
        group_number,
        period_number,
        electron_configuration,
        properties,
        applications,
        color,
        category,
        updated_at: db.fn.now(),
      })
      .returning("element_id");

    return updated;
  }

  static async deleteElement(elementId) {
    return db("elements")
      .where("element_id", elementId)
      .del()
      .returning("element_id");
  }
}

module.exports = ElementDao;
