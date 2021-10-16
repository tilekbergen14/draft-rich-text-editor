import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();
app.use(cors());

app.use("/images", express.static("images"));

app.get("/image", (req, res) => {
  res.json("Yeah I'm here");
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync("images/")) {
        fs.mkdirSync("images/");
      }
      cb(null, "images/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
});

app.post("/image", upload.single("file"), (req, res) => {
  const imageUrl = req.file.destination + req.file.filename;
  res.json({ imageUrl });
});

app.delete("/images/:id", async (req, res) => {
  try {
    const image = req.params.id;
    fs.unlink(`images/${image}`, () => {
      console.log("file deleted");
    });
    res.json("deleted");
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, console.log("Connected to server!"));
