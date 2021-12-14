const Card = require('../models/Card.js');
const { createCustomError } = require('../errors/custom-error.js');

const getAllCards = async (req, res) => {
    const cards = await Card.find({});
    res.status(200).json({cards});
};

const createCard = async (req, res) => {
    const card = await Card.create(req.body);
    res.status(201).json({card});
};

const getCard = async (req, res, next) => {
    const {id: card_id} = req.params;
    const card = await Card.findOne({card_id});
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({card});
};

const updateCard = async (req, res) => {
    const {id: card_id} = req.params;
    const card = await Card.findOneAndUpdate({
        card_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({card});
};

const deleteCard = async (req, res) => {
    const {id: card_id} = req.params;
    const card = await Card.findOneAndDelete({card_id});
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({msg: 'Card successfully deleted'});
};

const searchCards = async (req, res) => {
    const { search, limit } = req.query;
    let cards = await Card.find({});
    if (search) {
        cards = cards.filter((card) => {
            return card.name.toLowerCase().includes(search.toLowerCase());
        });
    }
    if (limit) {
        cards = cards.slice(0, Number(limit));
    }
    if (cards.length < 1) {
        return next(createCustomError(`No card found that includes: ${card_id}`, 404));
    }
    res.status(200).json({cards});
};

module.exports = {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    searchCards
};