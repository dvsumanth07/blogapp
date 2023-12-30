const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://dvsumanth78:sozXfJDr6hDidAJi@cluster0.iqbptrj.mongodb.net/"
);

const salt = bcrypt.genSaltSync(10);
const secret = "hfkebKFLher7iy3r87Y34GO8";
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    console.log(userDoc);
    res.status(200).json();
  } catch (e) {
    res.status(400).json(e);
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({
    username,
  });

  console.log(userDoc);
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("Invalid Credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});
app.listen(4000);
//sozXfJDr6hDidAJi
//dvsumanth78
//mongodb+srv://dvsumanth78:<password>@cluster0.iqbptrj.mongodb.net/
