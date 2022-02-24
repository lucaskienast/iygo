const User = require('../../models/User.js');
const {BadRequestError} = require('../../errors');
const {createHash} = require('../../helper');

const resetPassword = async (req, res, callback) => {
    const {token, email, password} = req.body;
    if (!token || !email || !password) {
        return callback(new BadRequestError('Please provide all values.'));
    }
    const user = await User.findOne({email});
    if (user) {
        const currentDate = new Date();
        if (user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await user.save();
        }
    }
    // again do not show client whether user exists or not
    return callback(null, {msg: "reset password route"});
};

module.exports = {
    resetPassword
}