const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    if (req.session.data == undefined) {
        res.redirect('/login');
    } else {
        res.sendFile(process.cwd() + '/public/views/main.html');
    }
});
router.post('/', (req, res) => {
    res.send(JSON.stringify({login: req.session.data.login}));
});
router.get('/main.js', (req, res) => {
    res.sendFile(process.cwd() + '/public/main.js');
});
router.get('/main.css', (req, res) => {
    res.sendFile(process.cwd() + '/public/styles/main.css');
});
module.exports = router;