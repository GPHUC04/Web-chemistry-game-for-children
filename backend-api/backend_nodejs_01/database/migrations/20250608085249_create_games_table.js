/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("games", (table) => {
    table.increments("game_id").primary();
    table.string("game_code", 20).notNullable().unique(); // master_chef, element_hunter...
    table.string("name_vi", 100).notNullable();
    table.string("name_en", 100).notNullable();
    table.text("description_vi");
    table.text("description_en");
    table.enu("category", [
      "reaction_game",
      "periodic_table",
      "lab_simulation",
      "puzzle_knowledge",
    ]);
    table.integer("max_score").defaultTo(1000);
    table.integer("time_limit").defaultTo(300); // giây
    table.boolean("is_active").defaultTo(true);
    table.json("game_settings"); // Cài đặt riêng cho từng game
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("games");
};
