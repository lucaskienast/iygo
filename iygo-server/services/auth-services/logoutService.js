const Token = require('../../models/Token.js');

const logout = async (req, res, callback) => {
    await Token.findOneAndDelete({user: req.user.userId});
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    return callback({msg: "Logout successful"});
};

module.exports = {
    logout
}