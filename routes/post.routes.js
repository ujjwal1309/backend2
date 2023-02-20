const express = require("express");
const { postModel } = require("../models/post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const { user } = req.body;
  const { device, device1, device2 } = req.query;
  try {
    if (device1 && device2) {
      const posts = await postModel.find({ user, device: device1 });
      const posts2 = await postModel.find({ user, device: device2 });
      res.send([...posts, ...posts2]);
    } else if (device) {
      const posts = await postModel.find({ user, device });
      res.send(posts);
    } else {
      const posts = await postModel.find({ user });
      res.send(posts);
    }
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

postRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.find({ _id: id });
    res.send(post);
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

postRouter.get("/top", async (req, res) => {
  const { user } = req.body;
  try {
    const posts = await postModel.find({ user }).sort({ no_of_comments: -1 });
    res.send(posts[0]);
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

postRouter.post("/add", async (req, res) => {
  try {
    const post = new postModel(req.body);
    await post.save();
    res.send({ msg: "post has been added" });
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await postModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: "post has been updated" });
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await postModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "post has been deleted" });
  } catch (error) {
    res.send({ msg: "error", error: error.message });
  }
});

module.exports = { postRouter };
