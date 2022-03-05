const Avatar = require('../../models/Avatar.js');

const getSingleAvatar = async (req, callback) => {
    const {id: avatar_id} = req.params;
    const avatar = await Avatar.findOne({_id: avatar_id});
    if (!avatar) {
        return callback(`No avatar with ID: ${avatar_id}`);
    }
    return callback(null, {avatar});
};

module.exports = {
    getSingleAvatar
}