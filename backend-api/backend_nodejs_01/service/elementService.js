const ElementDao = require("../dao/elementDao");

class ElementService {
  static async getAllElements() {
    try {
      const elements = await ElementDao.getAllElements();
      return {
        code: 200,
        message: "Lấy danh sách nguyên tố thành công",
        result: elements,
      };
    } catch (err) {
      throw {
        code: 500,
        message: "Lỗi server",
        error: err.message,
      };
    }
  }

  static async getElementById(elementId) {
    try {
      const element = await ElementDao.getElementById(elementId);
      if (!element) {
        throw {
          code: 404,
          message: "Không tìm thấy nguyên tố",
          error: "Element not found",
        };
      }
      return {
        code: 200,
        message: "Lấy thông tin nguyên tố thành công",
        result: element,
      };
    } catch (err) {
      throw {
        code: err.code || 500,
        message: err.message || "Lỗi server",
        error: err.error || "Database query failed",
      };
    }
  }

  static async createElement(elementData) {
    // Kiểm tra trùng lặp symbol hoặc atomic_number
    const existing = await ElementDao.findBySymbolOrAtomicNumber(
      elementData.symbol,
      elementData.atomic_number
    );

    if (existing) {
      const conflict =
        existing.symbol === elementData.symbol ? "symbol" : "atomic_number";

      throw {
        code: 400,
        message: `Nguyên tố với ${conflict} '${elementData[conflict]}' đã tồn tại.`,
      };
    }

    const elementId = await ElementDao.createElement(elementData);

    return {
      code: 201,
      message: "Tạo nguyên tố thành công",
      result: { element_id: elementId },
    };
  }

  static async updateElement(elementId, elementData) {
    if (!elementId || isNaN(parseInt(elementId))) {
      throw new Error("Invalid element ID");
    }

    const updatedElementId = await ElementDao.updateElement(
      elementId,
      elementData
    );
    if (updatedElementId.length === 0) {
      throw new Error("Element not found");
    }

    return { element_id: updatedElementId[0] };
  }

  static async deleteElement(elementId) {
    if (!elementId || isNaN(parseInt(elementId))) {
      throw new Error("Invalid element ID");
    }

    const deletedElementId = await ElementDao.deleteElement(elementId);
    if (deletedElementId.length === 0) {
      throw new Error("Element not found");
    }

    return { message: `Element with ID ${elementId} deleted successfully` };
  }
}

module.exports = ElementService;
