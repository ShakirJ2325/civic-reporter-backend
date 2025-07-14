import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/report", (req, res) => {
  const { issue, location } = req.body;
  if (!issue || !location?.lat || !location?.lon) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    "INSERT INTO reports (issue, latitude, longitude) VALUES (?, ?, ?)",
    [issue, location.lat, location.lon],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get("/api/reports", (req, res) => {
  db.all("SELECT * FROM reports ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
