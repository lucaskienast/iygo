const {StatusCodes} = require('http-status-codes');
const Avatar = require('../models/Avatar.js');
const {checkPermissions} = require('../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllAvatars = async (req, res) => {
    const avatars = await Avatar.find({});
    res.status(StatusCodes.OK).json({avatars});
};

const getSingleAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "get single avatar"});
};

const getCurrentUsersAvatars = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "get current user's avatars"});
};

const createAvatar = async (req, res) => {
    // check if fields empty
    const {
        name,
        desc,
        effect,
        images
    } = req.body;
    if (!name || !desc) { // add images and effect later
        throw new BadRequestError(`Please provide an avatar name, description, and at least one image.`);
    }

    /*
    // upload image to cloud
    let cloudImageUrls = [];
    for (let i = 0; i < images.length; i++) {
        // check if image has more than one colour ie. not blank
        console.log(images[i]);
        // upload image to cloud
        const publicImageUrl = await saveImageToCloudStorage(ygoproCardImageDuo[sizeKey].url, ygoproCardImageDuo[sizeKey].folder, ygoproAllCards[i].card_images[j].id);
        cloudImageUrls = [...cloudImageUrls, publicImageUrl];
    }
    // save avatar with image url from cloud
    */

    const avatar = await Avatar.create({
        name,
        desc,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({avatar});
};

const updateAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "update avatar"});
};

const deleteAvatar = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: "delete avatar"});
};

module.exports = {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
};