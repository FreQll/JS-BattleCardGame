const express = require('express');
const router = express.Router();

router.get('/game', (req, res) => {
    if (req.session.data == undefined) {
        res.redirect('/login');
    } else {
        res.sendFile(__dirname + '/public/views/game.html');
    }
});
router.get('/game.css', (req, res) => {
    res.sendFile(__dirname + '/public/styles/game.css');
});
router.get('/game.js', (req, res) => {
    res.sendFile(__dirname + '/public/game.js');
});
module.exports = router;