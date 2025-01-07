const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `audio_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Audio Upload API!");
});

// Upload audio file endpoint
app.post("/api/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log(`Audio file uploaded: ${req.file.filename}`);
  res.status(200).json({ message: "Audio uploaded successfully", filename: req.file.filename });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
