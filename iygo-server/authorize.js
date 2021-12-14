const authorize = (req, res, next) => {
    const { user } = req.query;
    if (user === "lucas") {
        req.user = {name: "lucas", id: 1};
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = authorize;