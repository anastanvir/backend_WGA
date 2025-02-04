const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

// Increase payload limit properly

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));
// app.use(bodyParser.json())
app.use(express.json())
// Ensure the uploads directory exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName); 
  },
});

const upload = multer({
  storage // Increase file size limit to 100MB
});

// Mongoose Schema
const Schema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  // imageURL: String,
});

const User = mongoose.model("User", Schema);

// Create User
app.post("/create", async (req, res) => {
  try {
    const { name, email, message } = req.body;
      // const imageURL = req.file
      //   ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      //   : null;
      console.log("Body:", req.body);
      // console.log("File:", req.file);

    const savedUser = new User({ name, email, message });
    const newUser = await savedUser.save();

    res.json({
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all data from the DB
app.get("/data", async (req, res) => {
  try {
    const getData = await User.find({});
    res.json(getData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get user by ID
app.get("/data/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Connect to MongoDB
const DB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-01", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
DB();

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});