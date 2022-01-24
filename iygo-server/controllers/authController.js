const {StatusCodes} = require('http-status-codes');
const User = require('../models/User.js');
const {
    createTokenUser,
    attachCookiesToResponse
} = require('../helper');
const {
    BadRequestError, 
    UnauthenticatedError
} = require('../errors');

const register = async (req, res) => {
    const {
        email,
        name,
        password
    } = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists) {
        throw new BadRequestError('Email already exists.')
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({
        name,
        email,
        role, 
        password
    });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    res.status(StatusCodes.CREATED).json({
        user: tokenUser,
    });
};

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password.');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials");
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    res.status(StatusCodes.CREATED).json({
        user: tokenUser,
    });
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({
        msg: "Logout successful"
    });
};

module.exports = {
    register,
    login,
    logout
}