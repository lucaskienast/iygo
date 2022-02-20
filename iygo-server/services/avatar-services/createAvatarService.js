const Avatar = require('../../models/Avatar.js');
const {BadRequestError} = require('../../errors');
const {saveImageToCloudStorageFromRequestFile} = require('../../helper');

const createAvatar = async (req, callback) => {
    // check if fields empty
    const {
        name,
        desc,
        effect,
        decks
    } = req.body;
    if (!name || !desc || !req.files) { // add images and effect later
        return callback(new BadRequestError(`Please provide an avatar name, description, and at least one image.`));
    }
    // check if avatar name already exists before saving image to cloud
    const image = req.files.image;
    const imageName = name.replace(/\s/g, "") + req.user.userId;
    const imageUrl = await saveImageToCloudStorageFromRequestFile(image, 'avatar-images', imageName);
    const avatar = await Avatar.create({
        name,
        desc,
        images: [imageUrl],
        user: req.user.userId
    });
    return callback(null, {avatar});
};

module.exports = {
    createAvatar
}