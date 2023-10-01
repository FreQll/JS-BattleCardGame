const express = require('express');
const router = express.Router();

router.get('/game', (req, res) => {
    if (req.session.data == undefined) {
        res.redirect('/login');
    } else {
        res.sendFile(process.cwd() + '/public/views/game.html');
    }
});
router.get('/game.css', (req, res) => {
    res.sendFile(process.cwd() + '/public/styles/game.css');
});
router.get('/game.js', (req, res) => {
    res.sendFile(process.cwd() + '/public/game.js');
});
module.exports = router;