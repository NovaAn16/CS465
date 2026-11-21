
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            try {
                const user = await User.findOne({
                    email: email
                }).exec();

                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email or password.'
                    });
                }

                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect email or password.'
                    });
                }

                return done(null, user);

            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports = passport;
