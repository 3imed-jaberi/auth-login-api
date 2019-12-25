const express = require('express');
const router = express.Router();
const passport = require ('passport');
const { register, login } = require('../controllers/userController');



// @route    POST api/register
// @desc     Register user ..
// @access   Public
router.post('/register', register);


// @route    POST api/auth
// @desc     Authenticate user & get token ..
// @access   Public
router.post('/auth', login);


// ###################################################################### //
router.all('*',(req, res, next) => {
  passport.authenticate('jwt', {session:false}, (err, user) => {

    if (err || !user){
      const error = new Error('You are not authorized to acces this area ..');
      error.status = 401 ;
      throw error ;
    }

    req.user = user;

    return next();

  })(req,res,next);
});
// ###################################################################### //


// @route    GET api/profile
// @desc     Simple response for test the protected route ..
// @access   Private { Protected Route }
router.get('/profile', (req, res, next) => res.json({ message: `Hi [${req.user.name}] welcome to your profile ..` }));


module.exports = router ;