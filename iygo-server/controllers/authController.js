const {StatusCodes} = require('http-status-codes');
const authServices = require('../services/auth-services');
const {
    BadRequestError, 
    UnauthenticatedError
} = require('../errors');

const register = async (req, res) => {
    await authServices.register(req, res, (error, result) => {
        if (error && error instanceof BadRequestError) {
            throw new BadRequestError(error.message);
        }
        return res.status(StatusCodes.CREATED).json(result);
    });
};

const login = async (req, res) => {
    await authServices.login(req, res, (error, result) => {
        if (error) {
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
            if (error instanceof UnauthenticatedError) {
                throw new UnauthenticatedError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const logout = async (req, res) => {
    await authServices.logout(req, res, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    register,
    login,
    logout
}