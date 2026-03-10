require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* init database */

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages(
        id SERIAL PRIMARY KEY,
        text VARCHAR(255)
      )
    `);

    console.log("messages table ready");

  } catch (err) {
    console.error("Database init error:", err);
  }
}

initDB();

/* routes */

app.get("/api/messages", async (req, res) => {
  const result = await pool.query("SELECT * FROM messages");
  res.json(result.rows);
});

app.post("/api/messages", async (req, res) => {

  const { text } = req.body;

  const result = await pool.query(
    "INSERT INTO messages(text) VALUES($1) RETURNING *",
    [text]
  );

  res.json(result.rows[0]);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});