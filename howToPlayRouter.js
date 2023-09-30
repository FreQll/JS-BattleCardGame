const express = require("express");
const router = express.Router();

router.get("/howToPlay", (req, res) => {
  if (req.session.data == undefined) {
    res.redirect("/login");
  } else {
    res.sendFile(__dirname + "/public/views/howToPlay.html");
  }
});

router.get("/howToPlay.css", (req, res) => {
  res.sendFile(__dirname + "/public/styles/howToPlay.css");
});

module.exports = router;
