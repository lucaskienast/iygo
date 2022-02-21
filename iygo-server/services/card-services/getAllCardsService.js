const sharedService = require('../shared-services/getCardsService.js');

const getAllCards = async (req, callback) => {
    const {sort, fields} = req.query;
    let result = sharedService.getCards(req.query);
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const cards = await result; 
    return callback({nbHits: cards.length, cards});
};

module.exports = {
    getAllCards
}