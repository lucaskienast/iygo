const {StatusCodes} = require('http-status-codes');
const avatarServices = require('../services/avatar-services');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllAvatars = async (req, res) => {
    await avatarServices.getAllAvatars(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const getSingleAvatar = async (req, res) => {
    await avatarServices.getSingleAvatar(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const getCurrentUsersAvatars = async (req, res) => {
    await avatarServices.getCurrentUsersAvatars(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const createAvatar = async (req, res) => {
    await avatarServices.createAvatar(req, (error, result) => {
        if (error) {
            throw new BadRequestError(error);
        }
        return res.status(StatusCodes.CREATED).json(result);
    });
};

const updateAvatar = async (req, res) => {
    await avatarServices.updateAvatar(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const deleteAvatar = async (req, res) => {
    await avatarServices.deleteAvatar(req, (error, result) => {
        if (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
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

module.exports = {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
};