const Card = require('../../models/Card.js');

const updateCard = async (req, callback) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndUpdate({
        card_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!card) {
        return callback(`No card with ID: ${card_id}`);
    }
    return callback(null, {card});
};

module.exports = {
    updateCard
}