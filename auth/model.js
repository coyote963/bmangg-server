const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})
/* TODO: Add signup view and encrypt the password */
UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    
    return password == user.password;
  }
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;