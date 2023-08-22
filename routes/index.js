var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('./users')


mongoose.connect('mongodb://0.0.0.0/google_drive_clone').then(() => {
  console.log("connected to database")
}).catch(err => {
  console.log(err)
});

/* user authentication related code */
var passport = require('passport')
var localStrategy = require('passport-local')
passport.use(new localStrategy(users.authenticate()))


/* authenticate request , is from loggedIn user */
function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/authenticate');
}
/* authenticate request , is from loggedIn user */

router.get('/authenticate', (req, res, next) => {
  res.render('register')
})
router.post('/register', async (req, res, next) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
    };

    // Register the user using Passport's register method
    const registeredUser = await users.register(newUser, req.body.password);

    // Update the user's root folder field with the default folder's ID
    await registeredUser.save();

    // Authenticate the user and redirect after successful registration
    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', err });
  }
});



router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/authenticate',
  }),
  (req, res, next) => { }
);

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});




/* user authentication related code */



/* GET home page. */
router.get('/', isloggedIn, async (req, res) => {
  try {
    res.render('index');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving user root folder', err });
  }
});




module.exports = router;
