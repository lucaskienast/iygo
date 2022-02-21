const User = require('../../models/User.js');
const {
    BadRequestError,
    UnauthenticatedError
} = require('../../errors');

const updateUserPassword = async (req, callback) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        return callback(new BadRequestError(`Please provide the old and new password.`));
    }
    const user = await User.findOne({_id: req.user.userId});
    // token is authenticated prior to this
    // ie no need to check if user exists
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        return callback(new UnauthenticatedError(`Invalid credentials.`));
    }
    user.password = newPassword;
    await user.save();
    // could have also used findOneAndUpdate
    callback(null, {msg: "Password successfully updated."});
};

module.exports = {
    updateUserPassword
}