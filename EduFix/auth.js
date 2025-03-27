require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();

app.use(express.json());
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile.name.givenName);
            console.log(profile)
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,  'index.html'));
    res.sendFile(path.join(__dirname,  'style.css'));
});
app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google callback route
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/failure'
}));

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});