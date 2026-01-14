module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "ep-purple-pond-ad9bz21s-pooler.c-2.us-east-1.aws.neon.tech",
      port: 5432,
      database: "neondb",
      user: "neondb_owner",
      password: "npg_Tjy4VAJxo5wZ",
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
