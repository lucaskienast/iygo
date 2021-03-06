const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide a deck name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    avatar: {
        // type: mongoose.Schema.ObjectId,
        // required: true,
        // ref: 'Avatar'
        type: String,
        required: false
    },
    nbCards: {
        type: Number,
        required: true
    },
    cards: {
        type: Array,
        required: [true, 'Must provide at least one card'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    } 
}, {timestamps: true}
);

module.exports = mongoose.model('Deck', DeckSchema);