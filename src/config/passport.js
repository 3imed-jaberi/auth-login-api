const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt ;

const User = require('../models/User');


module.exports = (passport) => {
  let config = {};
  config.secretOrKey = process.env.JWT_SECRET ;
  config.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  passport.use(new JwtStrategy(config,async(jwt_payload , done)=>{

      try {
            console.log(jwt_payload);
            
            const user = await User.findById(jwt_payload._id);

            if (user){
                return done(null , user);
            }else{
                return done(null,false);
            }
      }catch(err){
          return done(err,false);     
      }

  }));

};