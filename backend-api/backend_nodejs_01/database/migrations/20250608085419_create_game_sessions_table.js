exports.up = function (knex) {
  return knex.schema.createTable("game_sessions", (table) => {
    table.increments("session_id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("game_id").unsigned().notNullable();
    table.integer("score").defaultTo(0);
    table.integer("time_spent");
    table.enu("difficulty", ["easy", "medium", "hard", "expert"]);
    table
      .enu("status", ["playing", "completed", "abandoned"])
      .defaultTo("playing");
    table.json("game_data");
    table.timestamp("started_at").defaultTo(knex.fn.now());
    table.timestamp("completed_at");
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("game_id")
      .references("game_id")
      .inTable("games")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("game_sessions");
};
