/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("chemical_reactions", (table) => {
    table.increments("reaction_id").primary();
    table.string("equation", 500).notNullable(); // Phương trình phản ứng
    table.text("reactants"); // JSON - chất phản ứng
    table.text("products"); // JSON - sản phẩm
    table.enu("reaction_type", [
      "synthesis",
      "decomposition",
      "single_replacement",
      "double_replacement",
      "combustion",
      "acid_base",
      "redox",
      "precipitation",
    ]);
    table.text("conditions"); // Điều kiện phản ứng
    table.text("description_vi");
    table.text("description_en");
    table.enu("difficulty_level", ["easy", "medium", "hard", "expert"]);
    table.boolean("is_balanced").defaultTo(true);
    table.decimal("energy_change", 10, 2); // ΔH
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chemical_reactions");
};
