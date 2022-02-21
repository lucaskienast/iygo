const User = require('../../models/User.js');
const {
    BadRequestError,
    UnauthenticatedError
} = require('../../errors');
const {
    createTokenUser,
    attachCookiesToResponse
} = require('../../helper');

const login = async (req, res, callback) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return callback(new BadRequestError('Please provide email and password.'));
    }
    const user = await User.findOne({email});
    if (!user) {
        return callback(new UnauthenticatedError("Invalid credentials"));
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return callback(new UnauthenticatedError("Invalid credentials"));
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    return callback(null, {user: tokenUser});
};

module.exports = {
    login
}