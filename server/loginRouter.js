const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(process.cwd() + '/public/views/login.html');
});
router.post('/login', (req, res) => {
    try {
        if (req.body.login === '' || req.body.password === '') {
            throw new Error('All fields must be filled!');
        }
        loginCheck = new User();
        loginCheck.findByLogin(req.body.login)
            .then(results => {
                if (results.length === 0) {
                    res.send(JSON.stringify({ status: 'ERROR', message: 'Login dont exist' }));
                } else {
                    if (results[0].password === req.body.password) {
                        req.session.data = results[0];
                        res.send(JSON.stringify({ status: 'OK' }));
                    } else {
                        res.send(JSON.stringify({ status: 'ERROR', message: 'Password is incorrect' }));
                    }
                }
            })

    } catch (err) {
        res.send(JSON.stringify({ status: 'ERROR', message: err.message }));
    }
});

router.get('/registration', (req, res) => {
    res.sendFile(process.cwd() + '/public/views/register.html');
});
router.post('/registration', (req, res) => {
    try {
        if (req.body.login === '' || req.body.password === '') {
            throw new Error('All fields must be filled!');
        }
        loginCheck = new User();
        loginCheck.findByLogin(req.body.login)
            .then(results => {
                if (results.length != 0) {
                    res.send(JSON.stringify({ status: 'ERROR', message: 'Login already exists!' }));
                } else {
                    let user = new User(req.body.login, req.body.password);
                    user.save();
                    user.findByLogin(req.body.login).then(results => {
                        req.session.data = results[0];
                        res.send(JSON.stringify({ status: 'OK' }));
                    });
                }
            })

    } catch (err) {
        res.send(JSON.stringify({ status: 'ERROR', message: err.message }));
    }
});
router.get('/autorization.css', (req, res) => {
    res.sendFile(process.cwd() + '/public/styles/autorization.css');
});

module.exports = router;