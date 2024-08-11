import express from 'express';
import * as userService from '../services/users.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete user by id
router.delete('/:id', async (req, res) => {
    try {
        const users = await userService.deleteUser(req.params.id);
        console.log('User deleted');
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const users = await userService.createUser(req.body);

        res.status(201).json({
            message: `User ${req.body.username} created`,
            email: users.email,
            type: users.type
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const result = await userService.login(req.body);
        if (result.success) {
            // Create a token
            const token = jwt.sign({ email: result.user.email, type: result.user.type }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({
                message: `User ${result.user.username} logged in`,
                email: result.user.email,
                type: result.user.type,
                token: token
            });
        } else {
            res.status(401).json({ message: result.message });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
