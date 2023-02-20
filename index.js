const express = require("express");
const { connection } = require("./config/db");
const { authenticator } = require("./middlewares/authenticator");
const { postRouter } = require("./routes/post.routes");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

app.use("/users", userRouter);
app.use(authenticator);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  console.log("Server is running");
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log("DB isn't connected");
    console.log(error);
  }
});
