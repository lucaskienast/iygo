const {UnauthorizedError} = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    if (requestUser.role === 'admin') return; // all good and proceed
    if (requestUser.userId === resourceUserId.toString()) return; // also all good
    throw new UnauthorizedError("Not authorized to acces this route.");
};

module.exports = {checkPermissions};