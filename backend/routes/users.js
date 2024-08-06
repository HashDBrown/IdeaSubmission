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

//delete user by id
router.delete('/:id', async (req, res) => {
    try {
        const users = await userService.deleteUser(req.params.id);
        console.log('User deleted');
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//create user
router.post('/', async (req, res) => {
    try {
        const users = await userService.createUser(req.body);

        res.status(201).json({
            message: `User ${req.body.username} created`,
            email: users.email,
            type: users.type
        });
        // res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//login
router.post('/login', async (req, res) => {
    try {
        const result = await userService.login(req.body);
        if (result.success) {
            res.status(200).json({
                message: `User ${result.user.username} logged in`,
                email: result.user.email,
                type: result.user.type
            });
        } else {
            res.status(401).json({ message: result.message });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;
