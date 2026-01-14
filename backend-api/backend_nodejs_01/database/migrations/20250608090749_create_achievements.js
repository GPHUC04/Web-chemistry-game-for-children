/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("achievements", (table) => {
    table.increments("achievement_id").primary();
    table.string("code", 50).notNullable().unique();
    table.string("name_vi", 100).notNullable();
    table.string("name_en", 100).notNullable();
    table.text("description_vi");
    table.text("description_en");
    table.enu("category", [
      "score",
      "speed",
      "accuracy",
      "streak",
      "knowledge",
      "exploration",
      "safety",
    ]);
    table.json("requirements"); // Điều kiện đạt được
    table.integer("points_reward").defaultTo(0);
    table.string("badge_icon", 255);
    table.enu("rarity", ["common", "rare", "epic", "legendary"]);
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("achievements");
};
