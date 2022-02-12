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
    const {id: avatar_id} = req.params;
    const avatar = await Avatar.findOne({_id: avatar_id});
    if (!avatar) {
        throw new NotFoundError(`No avatar with ID: ${avatar_id}`);
    }
    res.status(StatusCodes.OK).json({avatar});
};

const getCurrentUsersAvatars = async (req, res) => {
    const user = req.user;
    const userAvatars = await Avatar.find({user: user.userId})
    res.status(StatusCodes.OK).json({nbHits: userAvatars.length, userAvatars});
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
    const {id: avatar_id} = req.params;
    const avatar = await Avatar.findOneAndUpdate({
        _id: avatar_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!avatar) {
        throw new NotFoundError(`No avatar with ID: ${avatar_id}`);
    }
    res.status(StatusCodes.OK).send({avatar});
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