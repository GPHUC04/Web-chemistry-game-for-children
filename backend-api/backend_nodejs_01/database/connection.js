const knex = require("knex");
const knexConfig = require("./knexfile");
const db = knex(knexConfig.development);

// Test database connection
db.raw("SELECT 1")
  .then(() => {
    console.log("Database connection successful.");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = db;
