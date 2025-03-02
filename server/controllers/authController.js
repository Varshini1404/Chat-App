const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        // 1. Validate input
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: 'Email and password are required.',
                success: false
            });
        }

        // 2. Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                message: 'User already exists.',
                success: false
            });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create and save the new user
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();

        // 5. Send success response
        res.status(201).send({
            message: 'User created successfully!',
            success: true
        });

    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).send({
            message: 'An error occurred during signup.',
            success: false
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        // 1. Validate input
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: 'Email and password are required.',
                success: false
            });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                message: 'User does not exist.',
                success: false
            });
        }

        // 3. Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({
                message: 'Invalid password.',
                success: false
            });
        }

        // 4. Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // 5. Send success response
        res.status(200).send({
            message: 'User logged in successfully.',
            success: true,
            token: token
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send({
            message: 'An error occurred during login.',
            success: false
        });
    }
});

module.exports = router;