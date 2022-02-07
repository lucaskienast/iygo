const {StatusCodes} = require('http-status-codes');
const Deck = require('../models/Deck');
const Card = require('../models/Card.js');
const User = require('../models/User');
const {checkPermissions} = require('../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllDecks = async (req, res) => {
    // extend for avatar and cards with amount
    const {
        name, // name of deck
        user, //userId
        nbCards, // #cards in deck
        sort,
        fields,
        cardFilters // intersection of all card filters (card api endpoint)
    } = req.query;
    const queryObject = {};
    if (user) {
        queryObject.user = user;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (nbCards) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filter = nbCards.replace(regEx, (match) => {
            return `-${operatorMap[match]}-`;
        });
        const [operator, value] = filter.split('-');
        queryObject.nbCards = { [operator]: Number(value)};
    }
    let result = Deck.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('created_at');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    // check if deck includes card filter set

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const decks = await result;
    res.status(StatusCodes.OK).json({nbHits: decks.length, decks});
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
    let nbCards = 0;
    for (const card of cards) {
        const dbCard = await Card.findOne({card_id: card.card_id});
        if (!dbCard) {
            throw new NotFoundError(`No card with id ${card.card_id}`);
        }
        const cardInDeck = {
            card_id: dbCard.card_id,
            amount: card.amount
        };
        cardsInDeck = [...cardsInDeck, cardInDeck];
        nbCards += card.amount;
    }
    const deck = await Deck.create({
        name,
        nbCards,
        cards: cardsInDeck,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({deck});
};

const updateDeck = async (req, res) => {
    res.status(StatusCodes.OK).send("update deck");
};

const deleteDeck = async (req, res) => {
    const {password} = req.body;
    const deckId = req.params.id;
    if (!password) {
        throw new BadRequestError(`Please provide a password.`);
    }
    if (!deckId) {
        throw new BadRequestError(`Please provide a deck id.`);
    }
    const deck = await Deck.findOne({_id: deckId});
    if (!deck) {
        throw new NotFoundError(`No deck with id ${deckId}`);
    }
    checkPermissions(req.user, deck.user);
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials.`);
    }
    await Deck.findOneAndDelete({_id: deckId});
    res.status(StatusCodes.OK).json({msg: 'Deck successfully deleted'});
};

module.exports = {
    getAllDecks,
    getSingleDeck,
    getCurrentUsersDecks,
    createDeck,
    updateDeck,
    deleteDeck
};