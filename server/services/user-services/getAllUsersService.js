const User = require('../../models/User.js');

const getAllUsers = async (req, callback) => {
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
    return callback({nbHits: users.length, users});
};

module.exports = {
    getAllUsers
}