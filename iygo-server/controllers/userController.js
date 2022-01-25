const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions
} = require('../helper');

const getAllUsers = async (req, res) => {
    const users = await User.find({role: "user"}).select("-password");
    res.status(StatusCodes.OK).send({users});
};

const getSingleUser = async (req, res) => {
    console.log("1");
    const user = await User.findOne({_id: req.params.id}).select('-password');
    console.log("2");
    if (!user) {
        console.log("Errrrrr");
        throw new NotFoundError(`No user with id: ${req.params.id}`);
    }
    console.log("3");
    res.status(StatusCodes.OK).json({user});
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).send("Show current user");
};

const updateUser = async (req, res) => {
    res.status(StatusCodes.OK).send("Update user");
};

const updateUserPassword = async (req, res) => {
    res.status(StatusCodes.OK).send("Update user password");
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}