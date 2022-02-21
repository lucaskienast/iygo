const User = require('../../models/User.js');
const {
    NotFoundError,
    BadRequestError
} = require('../../errors');
const {
    createTokenUser,
    attachCookiesToResponse
} = require('../../helper');

const updateUser = async (req, res, callback) => {
    const {email, name} = req.body;
    if (!email || !name) {
        return callback(new BadRequestError(`Please provide name and email.`));
    }
    const user = await User.findOne({_id: req.user.userId});
    if (!user) {
        return callback(new NotFoundError(`No user with ID: ${req.user.userId}`));
    }
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    return callback(null, {user: tokenUser});
};

module.exports = {
    updateUser
}