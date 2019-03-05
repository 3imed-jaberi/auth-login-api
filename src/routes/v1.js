const express = require('express');
const router = express.Router();
const passport = require ('passport');


const userController = require('../controllers/userController');


// inscription ..
router.post('/register',userController.register);

// login with auth .. 
router.post('/auth',userController.login);


// Middleware for don't repeate passport.auth ...
router.all('*',(req,res,next)=>{
  passport.authenticate('jwt',{session:false},(err,user)=>{
    if (err || !user){
          const error = new Error('You are not authorized to acces this area ..');
          error.status = 401 ;
          throw error ;
    }
    req.user = user;
    return next();
  })(req,res,next);
});


// Protected Routes ...
router.get('/profile',  // profile for exemple  .. 
  (req,res,next)=>{
   return res.json({message: `Hi ${req.user.name} welcome to your profile ..`});
});

module.exports = router ;