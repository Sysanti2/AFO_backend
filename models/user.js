const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    sexe:{
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        required: true 
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type: String,
    },
    role:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user',userSchema);
