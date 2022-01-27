const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', async function(/*next*/){
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    // this refers to the document ie the UserSchema
    this.password = await bcrypt.hash(this.password, salt);
    // next not needed but can be used
    //next();
});

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);