const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');

const { Schema } = mongoose ;



const UserSchema = Schema({
  name: { 
    type: String
  },
  email: { 
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true
  },
  joined: { 
    type: Date, 
    default: new Date()
  }
});


UserSchema.pre('save',async function (next) {
  
  if(!this.isModified('password')){
      return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password,salt);
    this.password = hashPassword ;
    next();
  } catch (error) {
    next(error);
  }
});


UserSchema.methods.isPasswordMatch = (password, hashed, callback) => {
  bcrypt.compare(password, hashed, (err , success) => err ? callback(err) : callback(null, success));
};


UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject ;
};


module.exports = mongoose.model('User', UserSchema);