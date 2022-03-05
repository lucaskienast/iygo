const Avatar = require('../../models/Avatar.js');
const User = require('../../models/User.js');
const {checkPermissions} = require('../../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../../errors');

const deleteAvatar = async (req, callback) => {
    const {password} = req.body;
    const avatarId = req.params.id;
    if (!password) {
        return callback(new BadRequestError(`Please provide a password.`));
    }
    if (!avatarId) {
        return callback(new BadRequestError(`Please provide an avatar id.`));
    }
    const avatar = await Avatar.findOne({_id: avatarId});
    if (!avatar) {
        return callback(new NotFoundError(`No avatar with id ${avatarId}`));
    }
    checkPermissions(req.user, avatar.user);
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return callback(new UnauthenticatedError(`Invalid credentials.`));
    }
    await Avatar.findOneAndDelete({_id: avatarId});
    return callback(null, {msg: 'Avatar successfully deleted'});
};

module.exports = {
    deleteAvatar
}