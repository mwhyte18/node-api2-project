const express = require("express");
const postsRouter = require("../posts/posts-router");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<p>Welcome to your posts and comments!<p>`);
});

server.use("/api/posts", postsRouter);

module.exports = server;
