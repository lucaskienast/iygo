const User = require('../../models/User.js');
const {
    BadRequestError, 
    UnauthenticatedError,
} = require('../../errors');

const deleteUser = async (req, res, callback) => {
    const {password} = req.body;
    if (!password) {
        return callback(new BadRequestError(`Please provide a password.`));
    }
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return callback(new UnauthenticatedError(`Invalid credentials.`));
    }
    await user.delete();
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    return callback(null, {msg: 'User successfully deleted'});
};

module.exports = {
    deleteUser
}