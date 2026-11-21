
const passport = require('passport');
const User = require('../models/user');

// POST /api/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            email: email
        }).exec();

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists.'
            });
        }

        // Create a new user
        const user = new User({
            name: name,
            email: email
        });

        // Hash and salt the password
        user.setPassword(password);

        // Save the user in MongoDB
        await user.save();

        // Generate a JSON Web Token
        const token = user.generateJWT();

        return res.status(201).json({
            token: token
        });

    } catch (err) {
        console.error('Registration error:', err);

        return res.status(500).json({
            message: 'Unable to register user.'
        });
    }
};

// POST /api/login
const login = (req, res) => {

    // Verify that email and password were provided
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'All fields are required.'
        });
    }

    // Authenticate using Passport's local strategy
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            console.error('Login error:', err);

            return res.status(500).json({
                message: 'Unable to complete login.'
            });
        }

        if (user) {
            // Authentication succeeded
            const token = user.generateJWT();

            return res.status(200).json({
                token: token
            });
        }

        // Authentication failed
        return res.status(401).json({
            message:
                info?.message ||
                'Incorrect email or password.'
        });

    })(req, res);
};

// Export both authentication endpoints
module.exports = {
    register,
    login
};
