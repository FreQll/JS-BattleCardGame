const express = require("express");
const router = express.Router();

router.get("/settings", (req, res) => {
  if (req.session.data == undefined) {
    res.redirect("/login");
  } else {
    res.sendFile(process.cwd() + "/public/views/settings.html");
  }
});

router.post("/settings", (req, res) => {
  res.send(JSON.stringify({ login: req.session.data.login }));
});

router.get("/settings.css", (req, res) => {
  res.sendFile(process.cwd() + "/public/styles/settings.css");
});

router.get("/settings.js", (req, res) => {
  res.sendFile(process.cwd() + "/public/settings.js");
});

router.post("/logout", (req, res) => {
  req.session.data = undefined;
  res.redirect("/login");
});

module.exports = router;
