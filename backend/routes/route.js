const express = require('express');
const router1 = express.Router();

router1.get('/home', (req, res) => {
    res.send('home page');
});

router1.get('/about', (req, res) => {
    res.send('about page');
});

router1.get('/info', (req, res) => {
    res.send('info page');
});

module.exports = { router1 };