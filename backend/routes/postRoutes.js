const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("userId", "username profilePicture");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/feed", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feed = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "username profilePicture");

    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const trendingPosts = await Post.find().sort({ commentCount: -1 }).limit(limit).populate("userId", "username profilePicture");
    res.json(trendingPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "username profilePicture");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 }).populate("userId", "username profilePicture");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  if (!req.body || !req.body.userId || !req.body.content) {
    return res.status(400).json({
      message: "Invalid request body. userId and content are required fields.",
      receivedBody: req.body,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userExists = await User.findById(req.body.userId);
    if (!userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: req.body.userId,
      content: req.body.content,
      media: req.body.media || "",
    });

    const savedPost = await post.save({ session });

    await User.findByIdAndUpdate(req.body.userId, { $inc: { postCount: 1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    const populatedPost = await Post.findById(savedPost._id).populate("userId", "username profilePicture");

    res.status(201).json(populatedPost);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      message: err.message,
      details: "Error creating post. Check that the userId is valid and all required fields are present.",
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      postId: req.params.id,
      userId: req.body.userId,
      content: req.body.content,
    });

    const savedComment = await comment.save({ session });

    await Post.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    const populatedComment = await Comment.findById(savedComment._id).populate("userId", "username profilePicture");

    res.status(201).json(populatedComment);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    Object.keys(req.body).forEach((key) => {
      post[key] = req.body[key];
    });

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate("userId", "username profilePicture");

    res.json(populatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    Object.keys(req.body).forEach((key) => {
      comment[key] = req.body[key];
    });

    const updatedComment = await comment.save();
    const populatedComment = await Comment.findById(updatedComment._id).populate("userId", "username profilePicture");

    res.json(populatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(req.params.id, { session });
    await Comment.deleteMany({ postId: req.params.id }, { session });
    await User.findByIdAndUpdate(post.userId, { $inc: { postCount: -1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
});

router.delete("/comments/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.findByIdAndDelete(req.params.id, { session });

    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
