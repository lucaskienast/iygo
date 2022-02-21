const logout = async (req, res, callback) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    return callback({msg: "Logout successful"});
};

module.exports = {
    logout
}