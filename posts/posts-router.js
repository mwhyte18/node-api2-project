const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

//add a post
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body).then(post => {
      Posts.findById(post.id).then(postObject => {
        res.status(201).json(postObject);
      });
    });
  }
});

//add a post comment
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const theComment = { ...req.body, post_id: id };
  if (id) {
    if (req.body.text) {
      Posts.insertComment(theComment).then(comment => {
        Posts.findCommentById(comment.id).then(commentObject => {
          res.status(201).json(commentObject);
        });
      });
    } else {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    }
  } else {
    res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }
});

//get posts
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//get specific post
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});
//get post comments
router.get("/:id/comments", (req, res) => {
  const postID = req.params.id;
  Posts.findPostComments(postID)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

//delete a post
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Posts.remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});
//edit a post
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  Posts.update(id, changes)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (!changes.title || !changes.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else {
          Posts.findById(id).then(postObject => {
            res.status(200).json(postObject);
          });
        }
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
