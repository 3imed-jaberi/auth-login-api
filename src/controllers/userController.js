const jwt = require('jsonwebtoken');
const User = require('../models/User');


const userController = {};

userController.register = async (req , res , next ) => {

  const { name , email , password , joiend } = req.body ; 

  const AddNewUser = new User({
    name,
    email,
    password,
    joiend
  });

  try {
        const user = await AddNewUser.save();
        return res.json(user); 
  } catch (error) {
      if (error.code === 11000 && error.name === 'MongoError'){
        let error = new Error(`The email address " ${AddNewUser.email} " is already taken ..`);
        next(error);
      }else{
        next(error);
    }     
  }

};

userController.login = async (req , res , next ) => {

  const { email , password } = req.body ;

  try {
    const user = await User.findOne({email});
    if (!user){
      const err = new Error (`The email " ${email} " was not found ..`);
      err.status = 401;
      next(err);
    }

    user.isPasswordMatch(password , user.password , (err , matched)=>{
      if (matched){
        const secret = process.env.JWT_SECRET ;
        const expire = process.env.JWT_EXPIRATION ;

        const token = jwt.sign({_id: user._id} , secret , {expiresIn:expire});
        return res.json({token: 'Bearer '+token});
      }
      res.status(401).json({error: 'Invalid Email/Password combination !'})
    });
  } catch (error) {
    next(error);
  }

};

module.exports = userController; 