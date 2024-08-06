const express = require('express');
const router = express.Router();
const userService = require('../services/users');

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
