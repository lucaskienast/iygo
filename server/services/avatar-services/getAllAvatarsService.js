const Avatar = require('../../models/Avatar.js');

const getAllAvatars = async (req, callback) => {
    const {
        name,
        desc,
        deck,
        sort,
        fields
    } = req.query;
    const queryObject = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (desc) {
        queryObject.desc = { $regex: desc, $options: 'i' };
    }
    if (deck) {
        queryObject.decks = { $all : [deck]};
    }
    let result = Avatar.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const avatars = await result;
    return callback({nbHits: avatars.length, avatars});
};

module.exports = {
    getAllAvatars
}