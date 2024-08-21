const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:true,
        trim:true
    }
    ,
    password:{
        type: String,
        required: true,
        trim: true,
    }
    ,
    isAdmin:{
        type: Boolean,
        default:false
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;