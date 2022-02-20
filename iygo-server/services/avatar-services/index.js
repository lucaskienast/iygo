const {getAllAvatars} = require('./getAllAvatarsService.js');
const {getSingleAvatar} = require('./getSingleAvatarService.js');
const {getCurrentUsersAvatars} = require('./getCurrentUsersAvatarsService.js');
const {createAvatar} = require('./createAvatarService.js');
const {updateAvatar} = require('./updateAvatarService.js');
const {deleteAvatar} = require('./deleteAvatarService.js');

module.exports = {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
}