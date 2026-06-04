require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "uploads/");
},

filename: (req, file, cb) => {
cb(null, Date.now() + "-" + file.originalname);
}
});

const upload = multer({ storage });

app.get("/", (req, res) => {
res.send("Hostel Management API is running...");
});

app.post("/register", async (req, res) => {
const { fullname, email, password } = req.body;

try {
const existingUser = await pool.query(
"SELECT * FROM users WHERE email = $1",
[email]
);

```
if (existingUser.rows.length > 0) {
  return res.status(400).json("User already exists");
}

const hashedPassword = await bcrypt.hash(password, 10);

await pool.query(
  "INSERT INTO users(fullname, email, password) VALUES ($1,$2,$3)",
  [fullname, email, hashedPassword]
);

res.json("User registered successfully");
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.post("/login", async (req, res) => {
const { email, password } = req.body;

try {
const user = await pool.query(
"SELECT * FROM users WHERE email = $1",
[email]
);

```
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
  token,
  user: user.rows[0]
});
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.post("/rooms", async (req, res) => {
const { room_number, type, price, status } = req.body;

try {
const room = await pool.query(
"INSERT INTO rooms(room_number,type,price,status) VALUES($1,$2,$3,$4) RETURNING *",
[room_number, type, price, status]
);

```
res.json(room.rows[0]);
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.get("/rooms", async (req, res) => {
try {
const rooms = await pool.query(
"SELECT * FROM rooms ORDER BY id ASC"
);

```
res.json(rooms.rows);
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.put("/rooms/:id", async (req, res) => {
const { id } = req.params;
const { room_number, type, price, status } = req.body;

try {
const room = await pool.query(
"UPDATE rooms SET room_number=$1,type=$2,price=$3,status=$4 WHERE id=$5 RETURNING *",
[room_number, type, price, status, id]
);

```
res.json(room.rows[0]);
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.delete("/rooms/:id", async (req, res) => {
const { id } = req.params;

try {
await pool.query(
"DELETE FROM rooms WHERE id=$1",
[id]
);

```
res.json("Room deleted");
```

} catch (err) {
res.status(500).json(err.message);
}
});

app.post("/upload", upload.single("file"), (req, res) => {
res.json({
message: "File uploaded successfully",
filename: req.file.filename
});
});

app.listen(5000, () => {
console.log("Server running on port 5000");
});
