const Avatar = require('../../models/Avatar.js');
const {saveImageToCloudStorageFromRequestFile} = require('../../helper');
const {NotFoundError} = require('../../errors');

const updateAvatar = async (req, callback) => {
    const {id: avatar_id} = req.params;
    let { name, decks } = req.body;
    let updateObject = req.body;
    if (req.files != null) {
        const image = req.files.image;
        const imageName = name.replace(/\s/g, "") + req.user.userId;
        const imageUrl = await saveImageToCloudStorageFromRequestFile(image, 'avatar-images', imageName);
        updateObject.images = [imageUrl];
    }
    decks = JSON.parse(decks).decks;
    updateObject.decks = decks;
    const avatar = await Avatar.findOneAndUpdate({
        _id: avatar_id
    }, updateObject, {
        new: true,
        runValidators: true
    });
    if (!avatar) {
        return callback(new NotFoundError(`No avatar with ID: ${avatar_id}`));
    }
    return callback(null, {avatar});
};

module.exports = {
    updateAvatar
}