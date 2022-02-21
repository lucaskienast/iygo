const User = require('../../models/User.js');
const {checkPermissions} = require('../../helper');
const {NotFoundError} = require('../../errors');

const getSingleUser = async (req, callback) => {
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
        return callback(new NotFoundError(`No user with id ${req.params.id}`));
    }
    checkPermissions(req.user, user._id);
    return callback(null, {user});
};

module.exports = {
    getSingleUser
}