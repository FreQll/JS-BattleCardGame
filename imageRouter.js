const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');
const User = require('./models/user');
const router = express.Router();
router.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);
router.get('/avatar/*.jpg', (req, res) => {
    let avatar = req.url.split('/')[2];
    let login = avatar.split('.')[0];
    let loginCheck = new User();
    loginCheck.findByLogin(login).then(results => {
        if (results.length === 0) {
            res.status(404).send('User not found');
        } else {
            let filePath = __dirname + '/public/avatars/' + avatar;
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    defaultFilePath = __dirname + '/public/default.jpg';
                    // File does not exist
                    fs.copyFile(defaultFilePath, filePath, (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error copying file');
                            return;
                        }
                        else {
                            res.sendFile(filePath);
                        }
                    });
                }
                else {
                    res.sendFile(filePath);
                }
            });
        }
    });
});
router.post('/update', (req, res) => {
    // Get the file that was set to our field named "image"
    if(req.files === undefined || req.files === null) return res.redirect('/');
    const { image } = req.files;
    // If no image submitted, exit
    if (!image) return res.redirect('/');
    console.log(image.mimetype);
    // If does not have image mime type prevent from uploading
    if (!(/^image/.test(image.mimetype))) return res.redirect('/');

    let size = 500;
    console.log("2");
    sharp(image.data)
        .metadata()
        .then(metadata => {
            if (metadata.width > metadata.height) {
                size = metadata.height;
            } else {
                size = metadata.width;
            }
            sharp(image.data)
                .resize({
                    width: size,
                    height: size,
                    fit: 'cover',
                    position: 'center'
                }).toFormat('jpg').toFile(__dirname + `/public/avatars/${req.session.data.login}.jpg`, (err, info) => {
                    if (err) {
                        console.error(err);
                        res.redirect('/');
                        return;
                    }
                    // All good
                    res.redirect('/');
                });
        });
});
module.exports = router;