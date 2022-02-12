const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide a card name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    desc: {
        type: String,
        required: false,
        trim: true,
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    effect: {
        type: Map,
        required: false // set to true after effect logic
    },
    images: {
        type: Array,
        required: true
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true}
);

module.exports = mongoose.model('Avatar', CardSchema);