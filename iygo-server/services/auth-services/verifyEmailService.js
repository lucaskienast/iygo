const User = require('../../models/User.js');
const { UnauthenticatedError } = require('../../errors');

const verifyEmail = async (req, res, callback) => {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return callback(new UnauthenticatedError('Verification failed.'));
    }
    if (user.verificationToken !== verificationToken) {
        return callback(new UnauthenticatedError('Verification failed.'));
    }
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';
    await user.save();
    return callback(null, { msg: 'Email verified.' });
};

module.exports = {
    verifyEmail
}