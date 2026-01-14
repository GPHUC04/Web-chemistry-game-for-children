/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("compounds", (table) => {
    table.increments("compound_id").primary();
    table.string("formula", 50).notNullable().unique(); // H₂O, NaCl...
    table.string("name_vi", 100).notNullable();
    table.string("name_en", 100).notNullable();
    table.decimal("molecular_mass", 10, 4);
    table.text("structure_info"); // Thông tin cấu trúc
    table.text("properties"); // JSON - tính chất vật lý, hóa học
    table.text("uses"); // Công dụng
    table.enu("compound_type", [
      "ionic",
      "covalent",
      "metallic",
      "acid",
      "base",
      "salt",
      "organic",
      "inorganic",
    ]);
    table.enu("difficulty_level", ["easy", "medium", "hard", "expert"]);
    table.string("image_url", 255);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("compounds");
};
