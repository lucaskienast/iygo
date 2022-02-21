const User = require('../../models/User.js');
const {BadRequestError} = require('../../errors');
const {
    createTokenUser,
    attachCookiesToResponse
} = require('../../helper');

const register = async (req, res, callback) => {
    const {
        email,
        name,
        password
    } = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists) {
        return callback(new BadRequestError('Email already exists.'));
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
    return callback(null, {user: tokenUser});
};

module.exports = {
    register
}