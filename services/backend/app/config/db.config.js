module.exports = {
  HOST: process.env.DATABASE_HOST,
  PORT: process.env.DATABASE_PORT,
  USER: process.env.MONGO_INITDB_USERNAME,
  PASS: process.env.MONGO_INITDB_PASSWORD,
  DB: process.env.MONGO_INITDB_DATABASE,
  TEST_DB: process.env.MONGO_INITDB_TEST_DATABASE,
};
