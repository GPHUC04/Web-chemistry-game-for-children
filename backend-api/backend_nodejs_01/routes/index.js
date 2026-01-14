const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const UserController = require("../controller/userController");
const ElementController = require("../controller/elementController");
const CompoundController = require("../controller/compoundController");
const ChemicalReactionController = require("../controller/chemicalReactionController");
const GameController = require("../controller/gameController");
const GameSessionController = require("../controller/gameSessionController");
const CrosswordPuzzleController = require("../controller/crosswordPuzzleController");

const { parseParams } = require("../middlewares/paramParser");
const { validateRequest } = require("../middlewares/validator.middleware");
const { z } = require("zod");
const { methodNotAllowed } = require("../controller/error.controller");
const multer = require("multer");
const upload = multer();
// Cấu hình multer
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/questions/"); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `question-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ định dạng JPG, PNG, JPEG"), false);
  }
};

const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Tạo thư mục uploads/questions nếu chưa tồn tại
const fs = require("fs");
const uploadDir = "uploads/questions/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Cấu hình static để phục vụ ảnh
router.use("/uploads", express.static("uploads"));

const gameSettingsSchema = z
  .union([
    z.string().refine(
      (val) => {
        if (val === "" || val === null) return true; // Cho phép chuỗi rỗng hoặc null
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "game_settings phải là chuỗi JSON hợp lệ hoặc chuỗi rỗng" }
    ),
    z.object({}).refine(
      (val) => {
        try {
          JSON.stringify(val); // Kiểm tra có thể chuyển thành JSON
          return true;
        } catch {
          return false;
        }
      },
      { message: "game_settings object không thể chuyển thành JSON" }
    ),
    z.null(), // Cho phép null
  ])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return null; // Chuyển chuỗi rỗng thành null
    return typeof val === "string" ? val : JSON.stringify(val);
  });
const gameDataSchema = z
  .union([
    z.string().refine(
      (val) => {
        if (val === "" || val === null) return true; // Cho phép chuỗi rỗng hoặc null
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "game_data phải là chuỗi JSON hợp lệ hoặc chuỗi rỗng" }
    ),
    z.object({}).refine(
      (val) => {
        try {
          JSON.stringify(val); // Kiểm tra có thể chuyển thành JSON
          return true;
        } catch {
          return false;
        }
      },
      { message: "game_data object không thể chuyển thành JSON" }
    ),
    z.null(), // Cho phép null
  ])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return null; // Chuyển chuỗi rỗng thành null
    return typeof val === "string" ? val : JSON.stringify(val);
  });

const jsonSchema = z
  .union([
    z.string().refine(
      (val) => {
        if (val === "" || val === null) return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Phải là chuỗi JSON hợp lệ, chuỗi rỗng, hoặc null" }
    ),
    z
      .union([
        z.record(z.any()), // Chấp nhận object
        z.array(z.any()), // Chấp nhận array
      ])
      .refine(
        (val) => {
          try {
            JSON.stringify(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Object hoặc array không thể chuyển thành JSON" }
      ),
    z.null(),
  ])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return null;
    return typeof val === "string" ? val : JSON.stringify(val);
  });

router.get("/elements", ElementController.getAllElements);
router.get("/elements/:elementId", ElementController.getElementById);
router.get("/users", UserController.getAllUsers);
router.get("/users/:userId", UserController.getUsersById);
router.get("/compounds", CompoundController.getAllCompounds);
router.get("/compounds/:compoundId", CompoundController.getCompoundById);
router.get(
  "/chemical-reactions",
  ChemicalReactionController.getAllChemicalReactions
);
router.get(
  "/chemical-reactions/:reactionId",
  ChemicalReactionController.getChemicalReactionById
);
router.get("/games", GameController.getAllGames);
router.get("/games/:gameId", GameController.getGameById);
router.get("/game-sessions", GameSessionController.getAllGameSessions);
router.get("/top-players", GameSessionController.getTopPlayers);
router.get(
  "/game-sessions/:sessionId",
  GameSessionController.getGameSessionById
);

router.get(
  "/crossword-puzzles",
  CrosswordPuzzleController.getAllCrosswordPuzzles
);
router.get(
  "/crossword-puzzles/:puzzleId",
  CrosswordPuzzleController.getCrosswordPuzzleById
);

router.post("/user/register", upload.none(), UserController.createUsers);
router.post("/user/login", upload.none(), UserController.loginUser);
router.post("/elements", upload.none(), ElementController.createElement);

router.post(
  "/compounds",
  CompoundController.uploadMiddleware(),
  CompoundController.createCompound
);
router.post(
  "/chemical-reactions",
  upload.none(),
  ChemicalReactionController.createChemicalReaction
);
router.post("/games", upload.none(), GameController.createGame);
router.post(
  "/game-sessions",
  upload.none(),
  GameSessionController.createGameSession
);

router.post(
  "/crossword-puzzles",
  CrosswordPuzzleController.createCrosswordPuzzle
);

router.put("/users/:id", upload.none(), UserController.updateUser);
// Update element by ID
router.put(
  "/users/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
        username: z.string().max(50).optional(),
        email: z.string().email().max(100).optional(),
        password: z.string().max(255).optional(),
        date_of_birth: z
          .string()
          .datetime({ offset: true }) // Chấp nhận datetime với múi giờ
          .optional()
          .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")),
        school: z.string().max(100).optional(),
        grade_level: z
          .enum(["6", "7", "8", "9", "10", "11", "12", "university", "other"])
          .optional(),
        total_score: z.number().nonnegative().optional(),
        total_games_played: z.number().nonnegative().optional(),
        level: z.number().min(1).optional(),
        experience_points: z.number().nonnegative().optional(),
        last_login: z.string().datetime().optional(),
        is_active: z.boolean().optional(),
        preferred_language: z.enum(["vi", "en"]).optional(),
      })
      .strict()
      .refine(
        (data) =>
          Object.keys(data).some((key) =>
            [
              "username",
              "email",
              "password",
              "date_of_birth",
              "school",
              "grade_level",
              "total_score",
              "total_games_played",
              "level",
              "experience_points",
              "last_login",
              "is_active",
              "preferred_language",
            ].includes(key)
          ),
        {
          message: "At least one field must be provided",
        }
      )
  ),
  UserController.updateUser
);

router.delete(
  "/users/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
      })
      .strict()
  ),
  UserController.deleteUser
);

router.put("/elements/:id", upload.none(), ElementController.updateElement);
router.delete(
  "/elements/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
      })
      .strict()
  ),
  ElementController.deleteElement
);

router.put(
  "/compounds/:id",
  CompoundController.uploadMiddleware(),
  CompoundController.updateCompound
);
router.delete(
  "/compounds/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
      })
      .strict()
  ),
  CompoundController.deleteCompound
);

router.put(
  "/chemical-reactions/:id",
  upload.none(),
  ChemicalReactionController.updateReaction
);
router.delete(
  "/chemical_reactions/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
      })
      .strict()
  ),
  ChemicalReactionController.deleteReaction
);

router.put("/games/:id", upload.none(), GameController.updateGame);

router.delete(
  "/games/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID must be a positive integer")
          .transform((val) => parseInt(val)),
      })
      .strict()
  ),
  GameController.deleteGame
);

router.put(
  "/game-sessions/:id",
  upload.none(),
  GameSessionController.updateSession
);

router.delete(
  "/game-sessions/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID phải là số nguyên dương")
          .transform((val) => parseInt(val))
          .refine((val) => val > 0, "ID phải là số nguyên dương"),
      })
      .strict()
  ),
  GameSessionController.deleteSession
);

// PUT /crossword_puzzles/:id
router.put(
  "/crossword_puzzles/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID phải là số nguyên dương")
          .transform((val) => parseInt(val))
          .refine((val) => val > 0, "ID phải là số nguyên dương"),
        created_by: z
          .number()
          .int()
          .positive("created_by phải là số nguyên dương")
          .nullable()
          .optional(),
        title_vi: z
          .string()
          .max(100, "title_vi tối đa 100 ký tự")
          .nonempty("title_vi là bắt buộc")
          .optional(),
        title_en: z
          .string()
          .max(100, "title_en tối đa 100 ký tự")
          .nonempty("title_en là bắt buộc")
          .optional(),
        grid_data: jsonSchema,
        clues_across: jsonSchema,
        clues_down: jsonSchema,
        solution: jsonSchema,
        difficulty_level: z
          .enum(["easy", "medium", "hard", "expert"])
          .optional(),
        grid_size: z
          .number()
          .int()
          .positive("grid_size phải là số nguyên dương")
          .optional(),
        is_public: z.boolean().optional(),
        is_approved: z.boolean().optional(),
        times_played: z.number().int().min(0).optional(),
        average_rating: z.number().min(0).max(9.99).nullable().optional(),
      })
      .strict()
      .refine(
        (data) =>
          Object.keys(data).some((key) =>
            [
              "created_by",
              "title_vi",
              "title_en",
              "grid_data",
              "clues_across",
              "clues_down",
              "solution",
              "difficulty_level",
              "grid_size",
              "is_public",
              "is_approved",
              "times_played",
              "average_rating",
            ].includes(key)
          ),
        { message: "Phải cung cấp ít nhất một trường để cập nhật" }
      )
  ),
  CrosswordPuzzleController.updateCrosswordPuzzle
);

// DELETE /crossword_puzzles/:id
router.delete(
  "/crossword_puzzles/:id",
  validateRequest(
    z
      .object({
        id: z
          .string()
          .regex(/^\d+$/, "ID phải là số nguyên dương")
          .transform((val) => parseInt(val))
          .refine((val) => val > 0, "ID phải là số nguyên dương"),
      })
      .strict()
  ),
  CrosswordPuzzleController.deleteCrosswordPuzzle
);

module.exports = router;
