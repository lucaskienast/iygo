const mongoose = require('mongoose');
const {
    CARD_TYPES, 
    CARD_RACES,
    CARD_ATTRIBUTES
} = require('../constants');

const CardSchema = new mongoose.Schema({
    card_id: {
        type: Number,
        required: [true, 'Must provide a card id'],
    },
    name: {
        type: String,
        required: [true, 'Must provide a card name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    type: {
        type: String,
        required: [true, 'Must provide a card type'],
        enum: {
            values: CARD_TYPES,
            message: '{VALUE} is not supported'
        }
    },
    desc: {
        type: String,
        required: false,
        trim: true,
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    atk: {
        type: Number,
        required: false, // if monster then true
        max: 5000,
        min: 0
    },
    def: {
        type: Number,
        required: false, // if monster then true
        max: 5000,
        min: 0
    },
    level: {
        type: Number,
        required: false, // if monster then true
        trim: true,
        max: 13,
        min: 0
    },
    race: {
        type: String,
        required: [true, 'Must provide a card race'], // provide limited options
        enum: {
            values: CARD_RACES,
            message: '{VALUE} is not supported'
        }
    },
    attribute: {
        type: String,
        required: false, // if monster then true + give options
        enum: {
            values: CARD_ATTRIBUTES,
            message: '{VALUE} is not supported'
        },
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
        max: 13,
        min: 0
    },
    effect: {
        type: Map,
        required: false // if not normal card true
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
    created_by: {
        type: mongoose.Schema.ObjectId, // future will be map of userId arrays for name, image, and effect
        ref: 'User',
        required: false // online if made via future card builder tool
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Card', CardSchema);