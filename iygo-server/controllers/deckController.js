const {StatusCodes} = require('http-status-codes');
const Deck = require('../models/Deck.js');
const Card = require('../models/Card.js');
const User = require('../models/User.js');
const {checkPermissions} = require('../helper');
const {getAllCards} = require('./cardsController.js');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllDecks = async (req, res) => {
    // extend for avatar and cards with amount
    const {
        name,
        user,
        nbCards,
        sort,
        fields,
    } = req.query;
    const {cardFilters} = req.body;
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

    let decks = await result;

    if (cardFilters) {
        let cardSets = [];
        for(let i = 0; i < cardFilters.length; i++) {
            const amount = cardFilters[i].amount;
            const criteria = cardFilters[i].criteria;
            const {
                type,
                race,
                attribute,
                name,
                numericFilters,
                // user query option for future custom user-made cards
            } = criteria;
            const queryObject = {};
            if (type) {
                queryObject.type = type;
            }
            if (race) {
                queryObject.race = race;
            }
            if (attribute) {
                queryObject.attribute = attribute;
            }
            /*if (user) {
                // queryObject.created_by equals or includes given user
                // user from personal token or input if not self
            }*/
            if (name) {
                queryObject.name = { $regex: name, $options: 'i' };
            }
            if (numericFilters) {
                const operatorMap = {
                    '>': '$gt',
                    '>=': '$gte',
                    '=': '$eq',
                    '<': '$lt',
                    '<=': '$lte'
                };
                const regEx = /\b(<|>|>=|=|<|<=)\b/g;
                let filters = numericFilters.replace(regEx, (match) => {
                    return `-${operatorMap[match]}-`;
                });
                const options = ['atk', 'def', 'level', 'scale'];
                filters = filters.split(',').forEach((item) => {
                    const [field, operator, value] = item.split('-');
                    if (options.includes(field)) {
                        queryObject[field] = { 
                            [operator]: Number(value) 
                        };
                    }
                });
            }
            let result = Card.find(queryObject).select(['card_id']);
            const cards = await result;
            cardSets = [...cardSets, {amount, cards}];
        }
        let filteredDecks = [];
        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i];
            let passedAllFilters = true;
            console.log("____________________________________________________");
            console.log(deck);
            for (let j = 0; j < cardSets.length; j++) {
                let filterHits = 0;
                const cardSet = cardSets[j];
                const cardSetAmount = cardSet.amount;
                console.log(cardSetAmount);
                const setCards = cardSet.cards;
                const setCardIds = setCards.map((setCard) => setCard.card_id);
                console.log(setCardIds);
                for (let k = 0; k < deck.cards.length; k++) {
                    const deckCard = deck.cards[k];
                    console.log(deckCard);
                    for (let l = 0; l < deckCard.amount; l++) {
                        if (setCardIds.includes(deckCard.card_id)){
                            filterHits++;
                        }
                        if (filterHits >= cardSetAmount) {
                            break;
                        }
                    }
                    if (filterHits >= cardSetAmount) {
                        break;
                    }
                }
                if (filterHits < cardSetAmount) {
                    passedAllFilters = false;
                }
                console.log(filterHits);
            }
            if (passedAllFilters === true) {
                filteredDecks = [...filteredDecks, deck];
            }
        }
        decks = filteredDecks;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    decks = decks.slice(skip, skip+limit);

    res.status(StatusCodes.OK).json({nbHits: decks.length, decks});
};

const getSingleDeck = async (req, res) => {
    const {id: deck_id} = req.params;
    const deck = await Deck.findOne({_id: deck_id});
    if (!deck) {
        throw new NotFoundError(`No deck with ID: ${deck_id}`);
    }
    res.status(StatusCodes.OK).json({deck});
};

const getCurrentUsersDecks = async (req, res) => {
    const user = req.user;
    const userDecks = await Deck.find({user: user.userId})
    res.status(StatusCodes.OK).json({nbHits: userDecks.length, userDecks});
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