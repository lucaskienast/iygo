const Token = require('../models/Token.js');
const {isTokenValid} = require('../helper');
const {
    UnauthenticatedError, 
    UnauthorizedError
} = require('../errors');
const {attachCookiesToResponse} = require('../helper');

const authenticateUser = async (req, res, next) => {
    const {refreshToken, accessToken} = req.signedCookies;
    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        });
        if (!existingToken || !existingToken.isValid) {
            throw new UnauthenticatedError("Authentification invalid.");
        }
        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken
        });
        req.user = payload.user;
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentification invalid.");
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError("Unauthorized to acces this route.");
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizePermissions
};