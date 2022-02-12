const {StatusCodes} = require('http-status-codes');
const Avatar = require('../models/Avatar.js');
const {checkPermissions} = require('../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllAvatars = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "get all avatars"});
};

const getSingleAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "get single avatar"});
};

const getCurrentUsersAvatars = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "get current user's avatars"});
};

const createAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "create an avatar"});
};

const updateAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "update avatar"});
};

const deleteAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "delete avatar"});
};

module.exports = {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
};