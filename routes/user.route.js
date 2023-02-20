const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      res.send({ msg: "User already exist, Please Login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const user = new UserModel({
            name,
            email,
            gender,
            password: hash,
            age,
            city,
          });
          await user.save();
          res.send({ msg: "User has been registered" });
        }
      });
    }
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          jwt.sign({ user: user[0]._id }, process.env.secret, (err, token) => {
            if (err) {
              console.log(err);
            } else {
              res.send({ msg: "Login success", token: token });
            }
          });
        } else {
          res.send({ msg: "Password doesn't match" });
        }
      });
    } else {
      res.send({ msg: "Email and password doesn't match" });
    }
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

module.exports = { userRouter };

/*
{
  "name":"ujjwal",
  "email":"ujjwal@gmail",
  "gendre":"male",
  "password":"sharma",
  "age":20,
  "city":"delhi"
}
*/
