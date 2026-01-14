// migrations/002_create_elements_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("elements", (table) => {
    table.increments("element_id").primary();
    table.string("symbol", 3).notNullable().unique(); // H, He, Li...
    table.string("name_en", 50).notNullable(); // Hydrogen, Helium...
    table.integer("atomic_number").notNullable().unique();
    table.decimal("atomic_mass", 8, 4).notNullable();
    table.integer("group_number"); // Nhóm trong bảng tuần hoàn
    table.integer("period_number"); // Chu kỳ
    table.string("electron_configuration", 100);
    table.text("properties"); // JSON string chứa các tính chất
    table.text("applications"); // Ứng dụng
    table.string("color", 20); // Màu sắc để hiển thị
    table.enu("category", [
      "metal",
      "nonmetal",
      "metalloid",
      "noble_gas",
      "alkali_metal",
      "alkaline_earth_metal",
      "transition_metal",
      "lanthanide",
      "actinide",
    ]);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("elements");
};
