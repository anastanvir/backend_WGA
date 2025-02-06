const express = require("express");
const DBConnection = require("./DB/DB");
const User = require("./Schema/UserSchema");
require("dotenv").config();
const app = express();

app.use(express.json())

app.post("/register",async (req, res) => {
  try {
    const { name, email, PhoneNumber } = req.body;
    const newUser = new User({
      name,
      email,
      PhoneNumber,
    });
    const savedUser = await newUser.save();
    res.json({
      message: "User Created Successfully",
      data: savedUser,
    });
  } catch (error) {
    res.json(error)
  }
});

DBConnection();
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`server is started ${PORT}`);
});
