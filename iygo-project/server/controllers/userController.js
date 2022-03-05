const {StatusCodes} = require('http-status-codes');
const userServices = require('../services/user-services');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllUsers = async (req, res) => {
    await userServices.getAllUsers(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const getSingleUser = async (req, res) => {
    await userServices.getSingleUser(req, (error, result) => {
        if (error && error instanceof NotFoundError) {
            throw new NotFoundError(error.message);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const showCurrentUser = async (req, res) => {
    await userServices.showCurrentUser(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const updateUser = async (req, res) => {
    await userServices.updateUser(req, res, (error, result) => {
        if (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const updateUserPassword = async (req, res) => {
    await userServices.updateUserPassword(req, (error, result) => {
        if (error) {
            if (error instanceof UnauthenticatedError) {
                throw new UnauthenticatedError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const deleteUser = async (req, res) => {
    await userServices.deleteUser(req, res, (error, result) => {
        if (error) {
            if (error instanceof UnauthenticatedError) {
                throw new UnauthenticatedError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
}