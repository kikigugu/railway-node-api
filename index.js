import express from "express";
import { createClient } from "@libsql/client";

const app = express();
app.use(express.json());

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Enable CORS so Chrome/Userscripts can call this API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

// Preflight OPTIONS request handling
app.options("*", (_, res) => res.sendStatus(200));

// Simple GET to check server
app.get("/", (req, res) => {
  res.json({ status: "Railway Node backend running 🚆" });
});

// GET endpoint to fetch data from Turso
app.get("/data", async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM TABLE01");
    
    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch data from database",
      error: error.message,
    });
  }
});

// POST endpoint to log actions
app.post("/log", async (req, res) => {
  const { uid, action } = req.body;

  if (!uid || !action) {
    return res.status(400).json({
      status: "error",
      message: "uid and action are required"
    });
  }

  try {
    // Log to console
    console.log("LOG:", uid, action);

    // Return proper status message
    return res.status(200).json({
      status: "success",
      message: "Log received",
      data: { uid, action }
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to log action",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
