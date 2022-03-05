const showCurrentUser = async (req, callback) => {
    return callback({user: req.user});
};

module.exports = {
    showCurrentUser
}