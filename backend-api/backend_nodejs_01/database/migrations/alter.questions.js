exports.up = function (knex) {
  return knex.schema.alterTable("questions", (table) => {
    table.integer("element_id").nullable();
    table.integer("compound_id").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("questions", (table) => {
    table.dropColumn("element_id");
    table.dropColumn("compound_id");
  });
};
