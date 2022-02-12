const mongoose = require('mongoose');

const AvatarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide an avatar name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    desc: {
        type: String,
        required: [true, 'Must provide an avatar description'],
        trim: true,
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    effect: {
        type: Map,
        required: false // set to true after effect logic
    },
    images: {
        type: Array,
        required: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true}
);

module.exports = mongoose.model('Avatar', AvatarSchema);