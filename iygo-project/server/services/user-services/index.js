const {getAllUsers} = require('./getAllUsersService.js');
const {getSingleUser} = require('./getSingleUserService.js');
const {showCurrentUser} = require('./showCurrentUserService.js');
const {updateUser} = require('./updateUserService.js');
const {updateUserPassword} = require('./updateUserPasswordService.js');
const {deleteUser} = require('./deleteUserService.js');

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
}