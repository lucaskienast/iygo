const Card = require('../../models/Card.js');

const deleteCard = async (req, callback) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndDelete({card_id});
    if (!card) {
        return callback(`No card with ID: ${card_id}`);
    }
    return callback(null, {msg: 'Card successfully deleted'});
};

module.exports = {
    deleteCard
}