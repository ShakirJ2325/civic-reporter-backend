import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded photos

// Setup Multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "")}`),
});
const upload = multer({ storage });

// POST route with photo upload
app.post("/api/report", upload.single("photo"), (req, res) => {
  const { issue, lat, lon } = req.body;
  const photoFilename = req.file ? req.file.filename : null;

  if (!issue || !lat || !lon) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO reports (issue, latitude, longitude, photo) VALUES (?, ?, ?, ?)`,
    [issue, lat, lon, photoFilename],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET all reports with full photo URLs
app.get("/api/reports", (req, res) => {
  db.all("SELECT * FROM reports ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    rows.forEach((row) => {
      if (row.photo) {
        row.photo_url = `${req.protocol}://${req.get("host")}/uploads/${row.photo}`;
      }
    });

    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
