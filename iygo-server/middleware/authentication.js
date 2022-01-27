const {isTokenValid} = require('../helper');
const {
    UnauthenticatedError, 
    UnauthorizedError
} = require('../errors');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token) {
        throw new UnauthenticatedError("Authentification invalid.");
    }
    try {
        const payload = isTokenValid({token});
        const {name, userId, role} = payload;
        req.user = { name, userId, role};
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