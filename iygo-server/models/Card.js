const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    card_id: {
        type: Number,
        required: [true, 'Must provide a card id'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, 'Name cannot be more than 40 characters']
    },
    type: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'Type cannot be more than 20 characters']
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Description cannot be more than 200 characters']
    },
    atk: {
        type: Number,
        required: false,
        max: 5000
    },
    def: {
        type: Number,
        required: false,
        max: 5000
    },
    level: {
        type: Number,
        required: false,
        trim: true,
        max: 12
    },
    race: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'Race cannot be more than 20 characters']
    },
    attribute: {
        type: String,
        required: false,
        trim: true,
        maxlength: [20, 'Attribute cannot be more than 20 characters']
    },
    archetype : {
        type: String,
        required: false,
        trim: true,
        maxlength: [40, 'Archetype cannot be more than 40 characters']
    },
    scale: {
        type: Number,
        required: false,
        trim: true,
        max: 13
    },
    effect_logic: {
        type: Map,
        required: false
    },
    card_sets: {
        type: Array,
        required: false
    },
    banlist_info: {
        type: Map,
        required: false
    },
    card_images: {
        type: Array,
        required: true
    },
    card_images: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('Card', CardSchema);