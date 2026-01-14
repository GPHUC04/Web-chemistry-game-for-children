/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_achievements", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("achievement_id").unsigned().notNullable();
    table.timestamp("earned_at").defaultTo(knex.fn.now());
    table.integer("progress").defaultTo(100); // % hoàn thành
    table.json("metadata"); // Dữ liệu bổ sung

    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("achievement_id")
      .references("achievement_id")
      .inTable("achievements")
      .onDelete("CASCADE");
    table.unique(["user_id", "achievement_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_achievements");
};
