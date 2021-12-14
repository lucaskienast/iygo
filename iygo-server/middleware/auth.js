const jwt = require("jsonwebtoken");
const {UnauthenticatedError} = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // in practice say smt like "Invalid credentials to access this route"
        throw new UnauthenticatedError('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
        // the var decoded carries the verified payload
        // ie here the id, username and valid timeframe
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {id, username} = decoded;
        req.user = {id, username};
        next(); // gives req.user property to controller ie next middleware
    } catch (error) {
        // be vague here too with the authorization error
        throw new UnauthenticatedError('Not authorized to access this route');
    }
};

module.exports = authenticationMiddleware;