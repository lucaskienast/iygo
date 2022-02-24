const crypto = require('crypto');
const User = require('../../models/User.js');
const {
    sendResetPasswordEmail,
    createHash
} = require('../../helper');
const {BadRequestError} = require('../../errors');

const forgotPassword = async (req, res, callback) => {
    const {email} = req.body;
    if (!email) {
        return callback(new BadRequestError('Please provide your valid email.'));
    }
    const user = await User.findOne({email});
    if (user) {
        // do not tell client whether user with email exists or not
        const passwordToken = crypto.randomBytes(70).toString('hex');
        // send email
        const origin = 'http://localhost:3000';
        await sendResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: passwordToken,
            origin
        });
        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }
    return callback(null, {msg: "Please check your email for reset password link."});
};

module.exports = {
    forgotPassword
}