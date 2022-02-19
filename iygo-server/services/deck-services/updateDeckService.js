const Deck = require('../../models/Deck.js');
const Card = require('../../models/Card.js');
const {
    BadRequestError, 
    NotFoundError
} = require('../../errors');

const updateDeck = async (req, callback) => {
    const {id: deck_id} = req.params;
    const deck = await Deck.findOne({_id: deck_id});
    if (!deck) {
        return callback(new NotFoundError(`No deck with ID: ${deck_id}`));
    }
    const {name, cards} = req.body;
    if (!name && !cards) {
        return callback(new BadRequestError(`Please provide either a new deck name or a different set of cards.`));
    }
    let cardsInDeck = [];
    let nbCards = 0;
    for (const card of cards) {
        const dbCard = await Card.findOne({card_id: card.card_id});
        if (!dbCard) {
            return callback(new NotFoundError(`No card with id ${card.card_id}`));
        }
        const cardInDeck = {
            card_id: dbCard.card_id,
            amount: card.amount
        };
        cardsInDeck = [...cardsInDeck, cardInDeck];
        nbCards += card.amount;
    }
    deck.name = name;
    deck.cards = cards;
    deck.nbCards = nbCards;
    await deck.save();
    return callback(null, {deck});
};

module.exports = {
    updateDeck
}