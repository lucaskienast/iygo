const {StatusCodes} = require('http-status-codes');
const Deck = require('../models/Deck');
const Card = require('../models/Card.js');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllDecks = async (req, res) => {
    res.status(StatusCodes.OK).send("get all decks");
};

const getSingleDeck = async (req, res) => {
    res.status(StatusCodes.OK).send("get single deck");
};

const getCurrentUsersDecks = async (req, res) => {
    res.status(StatusCodes.CREATED).send("get current user's decks");
};

const createDeck = async (req, res) => {
    const { name, cards } = req.body;
    if (!cards) {
        throw new BadRequestError("No cards provided");
    }
    let cardsInDeck = [];
    for (const card of cards) {
        const dbCard = await Card.findOne({card_id: card.card_id});
        if (!dbCard) {
            throw new NotFoundError(`No product with id ${card.card_id}`);
        }
        const cardInDeck = {
            card_id: dbCard.card_id,
            amount: card.amount
        };
        cardsInDeck = [...cardsInDeck, cardInDeck];
    }
    const deck = await Deck.create({
        name,
        cards: cardsInDeck,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({deck});
};

const updateDeck = async (req, res) => {
    res.status(StatusCodes.OK).send("update deck");
};

const deleteDeck = async (req, res) => {
    res.status(StatusCodes.OK).send("delete deck");
};

module.exports = {
    getAllDecks,
    getSingleDeck,
    getCurrentUsersDecks,
    createDeck,
    updateDeck,
    deleteDeck
};