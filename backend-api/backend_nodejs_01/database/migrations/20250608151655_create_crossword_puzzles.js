/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("crossword_puzzles", (table) => {
    table.increments("puzzle_id").primary();
    table.integer("created_by").unsigned(); // user_id người tạo
    table.string("title_vi", 100).notNullable();
    table.string("title_en", 100).notNullable();
    table.json("grid_data"); // Dữ liệu lưới ô chữ
    table.json("clues_across"); // Gợi ý hàng ngang
    table.json("clues_down"); // Gợi ý hàng dọc
    table.json("solution"); // Đáp án
    table.enu("difficulty_level", ["easy", "medium", "hard", "expert"]);
    table.integer("grid_size").defaultTo(15); // 15x15
    table.boolean("is_public").defaultTo(true);
    table.boolean("is_approved").defaultTo(false);
    table.integer("times_played").defaultTo(0);
    table.decimal("average_rating", 3, 2);
    table.timestamps(true, true);

    table
      .foreign("created_by")
      .references("user_id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("crossword_puzzles");
};
