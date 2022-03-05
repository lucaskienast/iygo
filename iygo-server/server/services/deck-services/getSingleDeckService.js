const Deck = require('../../models/Deck.js');

const getSingleDeck = async (req, callback) => {
    const {id: deck_id} = req.params;
    const deck = await Deck.findOne({_id: deck_id});
    if (!deck) {
        return callback(`No deck with ID: ${deck_id}`);
    }
    return callback(null, {deck});
};

module.exports = {
    getSingleDeck
}