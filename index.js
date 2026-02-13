import express from "express";

const app = express();
app.use(express.json());

// CORS (important for Chrome)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.options("*", (_, res) => res.sendStatus(200));

app.post("/log", (req, res) => {
  const { uid, action } = req.body;

  if (!uid || !action) {
    return res.status(400).json({
      status: "error",
      message: "uid and action are required"
    });
  }

  console.log("LOG:", uid, action);

  return res.status(200).json({
    status: "success",
    message: "Log received",
    data: {
      uid,
      action
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
