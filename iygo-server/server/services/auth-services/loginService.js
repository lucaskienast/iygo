const crypto = require('crypto');
const User = require('../../models/User.js');
const Token = require('../../models/Token.js');
const {createTokenUser} = require('../../helper');
const {attachCookiesToResponse} = require('../../helper');
const {
    BadRequestError,
    UnauthenticatedError
} = require('../../errors');

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
    if (!user.isVerified) {
        return callback(new UnauthenticatedError("Please verify your email."));
    }
    const tokenUser = createTokenUser(user);
    let refreshToken = '';
    // create refresh token
    const existingToken = await Token.findOne({user: user._id});
    if (existingToken) {
        const {isValid} = existingToken;
        if (!isValid) {
            return callback(new UnauthenticatedError("Invalid credentials"));
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({
            res,
            user: tokenUser,
            refreshToken
        });
        return callback(null, {user: tokenUser});
    }
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = {
        refreshToken,
        ip,
        userAgent,
        user: user._id
    };
    await Token.create(userToken);
    // check for existing token
    attachCookiesToResponse({
        res,
        user: tokenUser,
        refreshToken
    });
    return callback(null, {user: tokenUser});
};

module.exports = {
    login
}