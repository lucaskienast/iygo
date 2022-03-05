const Deck = require('../../models/Deck.js');
const Card = require('../../models/Card.js');
const {
    BadRequestError, 
    NotFoundError
} = require('../../errors');

const createDeck = async (req, callback) => {
    const { name, cards } = req.body;
    if (!cards || !(cards.length > 0)) {
        return callback(new BadRequestError("No cards provided"));
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
    const deck = await Deck.create({
        name,
        nbCards,
        cards: cardsInDeck,
        user: req.user.userId
    });
    return callback(null, {deck});
};

module.exports = {
    createDeck
}