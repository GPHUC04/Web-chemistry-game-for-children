// 6. Bảng Questions - Câu hỏi cho các trò chơi
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("questions", (table) => {
    table.increments("question_id").primary();
    table.integer("game_id").unsigned().notNullable();
    table.text("question_vi").notNullable();
    table.text("question_en").notNullable();
    table.json("options");
    table.text("correct_answer");
    table.text("explanation_vi");
    table.text("explanation_en");
    table.enu("question_type", [
      "multiple_choice",
      "fill_blank",
      "matching",
      "drag_drop",
      "formula_input",
    ]);
    table.enu("difficulty_level", ["easy", "medium", "hard", "expert"]);
    table.integer("points").defaultTo(10);
    table.string("image_url", 255);
    table.json("metadata"); // Dữ liệu bổ sung
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("game_id")
      .references("game_id")
      .inTable("games")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("questions");
};
