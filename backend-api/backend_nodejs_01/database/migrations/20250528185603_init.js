/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary(); // INT AUTO_INCREMENT PRIMARY KEY
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password", 255).notNullable();
    table.date("date_of_birth");
    table.string("school", 100);
    table.enu("grade_level", [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "university",
      "other",
    ]);
    table.integer("total_score").defaultTo(0);
    table.integer("total_games_played").defaultTo(0);
    table.integer("level").defaultTo(1);
    table.integer("experience_points").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("last_login");
    table.boolean("is_active").defaultTo(true);
    table.enu("preferred_language", ["vi", "en"]).defaultTo("vi");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
