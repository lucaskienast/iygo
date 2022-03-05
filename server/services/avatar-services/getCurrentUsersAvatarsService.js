const Avatar = require('../../models/Avatar.js');

const getCurrentUsersAvatars = async (req, callback) => {
    const user = req.user;
    const userAvatars = await Avatar.find({user: user.userId})
    return callback({nbHits: userAvatars.length, userAvatars});
};

module.exports = {
    getCurrentUsersAvatars
}