const Deck = require('../../models/Deck.js');
const User = require('../../models/User.js');
const {checkPermissions} = require('../../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../../errors');

const deleteDeck = async (req, callback) => {
    const {password} = req.body;
    const deckId = req.params.id;
    if (!password) {
        return callback(new BadRequestError(`Please provide a password.`));
    }
    if (!deckId) {
        return callback(new BadRequestError(`Please provide a deck id.`));
    }
    const deck = await Deck.findOne({_id: deckId});
    if (!deck) {
        return callback(new NotFoundError(`No deck with id ${deckId}`));
    }
    checkPermissions(req.user, deck.user);
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return callback(new UnauthenticatedError(`Invalid credentials.`));
    }
    await Deck.findOneAndDelete({_id: deckId});
    return callback(null, {msg: 'Deck successfully deleted'});
};

module.exports = {
    deleteDeck
}