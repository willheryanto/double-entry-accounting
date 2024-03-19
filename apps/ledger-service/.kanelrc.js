const { makeKyselyHook } = require("kanel-kysely");

module.exports = {
  connection: {
    host: "localhost",
    user: "example",
    password: "example",
    database: "ledger-service",
    charset: "utf8",
    port: 5432,
  },
  resolveViews: true,
  preDeleteOutputFolder: true,
  outputPath: "src/models",
  customTypeMap: {
    "pg_catalog.tsvector": "string",
  },
  preRenderHooks: [makeKyselyHook()],
  customTypeMap: {
    "pg_catalog.json": "string",
    "pg_catalog.jsonb": "string",
  },
};
