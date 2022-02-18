const Card = require('../../models/Card.js');

const createCard = async (req, callback) => {
    const card = await Card.create(req.body);
    return callback({card});
};

module.exports = {
    createCard
}