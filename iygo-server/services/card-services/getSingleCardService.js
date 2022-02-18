const Card = require('../../models/Card.js');

const getSingleCard = async (req, callback) => {
    const {id: card_id} = req.params;
    const card = await Card.findOne({card_id});
    if (!card) {
        return callback(`No card with ID: ${card_id}`);
    }
    return callback(null, {card});
};

module.exports = {
    getSingleCard
}