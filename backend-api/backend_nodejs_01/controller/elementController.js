const ElementService = require("../service/elementService");
const JSend = require("../jsend");
class ElementController {
  static async getAllElements(req, res) {
    try {
      const response = await ElementService.getAllElements();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getElementById(req, res) {
    try {
      const response = await ElementService.getElementById(
        req.params.elementId
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createElement(req, res) {
    try {
      const response = await ElementService.createElement(req.body);
      return res.status(201).json(response);
    } catch (err) {
      console.error("Lỗi khi tạo nguyên tố:", err);

      return res.status(err.code || 500).json({
        code: err.code || 500,
        message: err.message || "Lỗi server",
      });
    }
  }
  static async updateElement(req, res, next) {
    try {
      const elementId = parseInt(req.params.id);
      const elementData = req.body;
      const result = await ElementService.updateElement(elementId, elementData);
      return res.json(JSend.success(result));
    } catch (error) {
      if (error.message === "Element not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }

  static async deleteElement(req, res, next) {
    try {
      const elementId = parseInt(req.params.id);
      const result = await ElementService.deleteElement(elementId);
      return res.json(JSend.success(result));
    } catch (error) {
      if (error.message === "Element not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }
}

module.exports = ElementController;
