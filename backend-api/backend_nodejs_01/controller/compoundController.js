const CompoundService = require("../service/compoundService");
const JSend = require("../jsend");
const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store images in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

class CompoundController {
  static async getAllCompounds(req, res) {
    try {
      const response = await CompoundService.getAllCompounds();
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async getCompoundById(req, res) {
    try {
      const response = await CompoundService.getCompoundById(
        req.params.compoundId
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(err.code || 500).json(err);
    }
  }

  static async createCompound(req, res) {
    try {
      const compoundData = req.body;
      if (req.file) {
        compoundData.image_url = `/uploads/${req.file.filename}`;
      }
      const response = await CompoundService.createCompound(compoundData);
      return res.status(201).json(response);
    } catch (err) {
      console.error("Lỗi khi tạo hợp chất:", err);
      return res.status(err.code || 500).json({
        code: err.code || 500,
        message: err.message || "Lỗi server",
      });
    }
  }

  static async updateCompound(req, res, next) {
    try {
      console.log("Controller updateCompound called with id:", req.params.id);
      const compoundId = parseInt(req.params.id);
      const compoundData = req.body;
      if (req.file) {
        compoundData.image_url = `/uploads/${req.file.filename}`;
      }
      const result = await CompoundService.updateCompound(
        compoundId,
        compoundData
      );
      return res.json(JSend.success(result));
    } catch (error) {
      console.error("Controller updateCompound error:", error);
      if (error.message === "Compound not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }

  static async deleteCompound(req, res, next) {
    try {
      console.log("Controller deleteCompound called with id:", req.params.id);
      const compoundId = parseInt(req.params.id);
      const result = await CompoundService.deleteCompound(compoundId);
      return res.json(JSend.success(result));
    } catch (error) {
      console.error("Controller deleteCompound error:", error);
      if (error.message === "Compound not found") {
        return next({ status: 404, message: error.message });
      }
      return next({ status: 400, message: error.message });
    }
  }

  // Expose upload middleware for routes
  static uploadMiddleware() {
    return upload.single("image");
  }
}

module.exports = CompoundController;
