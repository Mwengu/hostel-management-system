require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* =======================
   TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("Hostel Management API is running...");
});

/* =======================
   REGISTER ROUTE
======================= */
app.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(fullname, email, password) VALUES ($1, $2, $3)",
      [fullname, email, hashedPassword]
    );

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* =======================
   LOGIN ROUTE
======================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json("User not found");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json("Incorrect password");
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        fullname: user.rows[0].fullname,
        email: user.rows[0].email
      }
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* =======================
   ROOMS CRUD
======================= */

// CREATE ROOM
app.post("/rooms", async (req, res) => {
  const { room_number, type, price, status } = req.body;

  try {
    const newRoom = await pool.query(
      "INSERT INTO rooms (room_number, type, price, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [room_number, type, price, status || "available"]
    );

    res.json(newRoom.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET ALL ROOMS
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
    res.json(rooms.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE ROOM
app.put("/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const { room_number, type, price, status } = req.body;

  try {
    const updatedRoom = await pool.query(
      "UPDATE rooms SET room_number=$1, type=$2, price=$3, status=$4 WHERE id=$5 RETURNING *",
      [room_number, type, price, status, id]
    );

    res.json(updatedRoom.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE ROOM
app.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM rooms WHERE id=$1", [id]);
    res.json("Room deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* =======================
   START SERVER
======================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});