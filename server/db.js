const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hostel_management",
  password: "mzn18",
  port: 5432,
});

module.exports = pool;

