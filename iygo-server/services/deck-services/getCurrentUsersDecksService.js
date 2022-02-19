const Deck = require('../../models/Deck.js');

const getCurrentUsersDecks = async (req, callback) => {
    const user = req.user;
    const userDecks = await Deck.find({user: user.userId})
    return callback({nbHits: userDecks.length, userDecks});
};

module.exports = {
    getCurrentUsersDecks
}