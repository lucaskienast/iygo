const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions
} = require('../helper');

const getAllUsers = async (req, res) => {
    const {
        email, 
        name,
        sort,
        fields
    } = req.query;
    const queryObject = {};
    if (email) {
        queryObject.email = { $regex: email, $options: 'i' };
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    let result = User.find({...queryObject, role: "user"});
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('created_at');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = await result.select("-password");
    res.status(StatusCodes.OK).send({nbHits: users.length, users});
};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
        throw new NotFoundError(`No user with id: ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
};

const updateUser = async (req, res) => {
    const {email, name} = req.body;
    if (!email || !name) {
        throw new BadRequestError(`Please provide name and email.`);
    }
    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    res.status(StatusCodes.OK).json({user: tokenUser});
};

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError(`Please provide the old and new password.`);
    }
    const user = await User.findOne({_id: req.user.userId});
    // token is authenticated prior to this
    // ie no need to check if user exists
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials.`);
    }
    user.password = newPassword;
    await user.save();
    // could have also used findOneAndUpdate
    res.status(StatusCodes.OK).json({msg: "Password successfully updated."});
};

const deleteUser = async (req, res) => {
    const {password} = req.body;
    if (!password) {
        throw new BadRequestError(`Please provide a password.`);
    }
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials.`);
    }
    await user.delete();
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({msg: 'User successfully deleted'});
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
}