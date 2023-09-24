//BEFORE STARTING SERVER
//(for windows)
//Get-Content db.sql | mysql -u root -p

const port = 3000;

const User = require('./models/user');
const express = require('express');
const loginRouter = require('./loginRouter');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

session = require('express-session');
app.use(
    session({
        secret: 'yousecretkey3',
        saveUninitialized: true,
        resave: true
    })
);
app.use(loginRouter);

app.get('/', (req, res) => {
    // res.redirect('/login');
    if (req.session.data == undefined) {
        res.redirect('/login');
    } else {
        res.sendFile(__dirname + '/public/views/index.html');
    }
});
app.post('/', (req, res) => {
    res.send(JSON.stringify({login: req.session.data.login, role: req.session.data.role}));
});