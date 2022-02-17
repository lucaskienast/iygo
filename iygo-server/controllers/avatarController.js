const {StatusCodes} = require('http-status-codes');
const Avatar = require('../models/Avatar.js');
const User = require('../models/User.js');
const {checkPermissions} = require('../helper');
const {
    saveImageToCloudStorage,
    saveImageToCloudStorageFromRequestFile,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('../helper');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllAvatars = async (req, res) => {
    const {
        name,
        desc,
        deck,
        sort,
        fields
    } = req.query;
    const queryObject = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (desc) {
        queryObject.desc = { $regex: desc, $options: 'i' };
    }
    if (deck) {
        queryObject.decks = { $all : [deck]};
    }
    let result = Avatar.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const avatars = await result;
    res.status(StatusCodes.OK).json({nbHits: avatars.length, avatars});
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
        decks
    } = req.body;
    const image = req.files.image;
    if (!name || !desc || !image) { // add images and effect later
        throw new BadRequestError(`Please provide an avatar name, description, and at least one image.`);
    }
    const imageName = name.replace(/\s/g, "") + req.user.userId;
    const imageUrl = await saveImageToCloudStorageFromRequestFile(image, 'avatar-images', imageName);
    const avatar = await Avatar.create({
        name,
        desc,
        images: [imageUrl],
        user: req.user.userId
    });
    res.status(StatusCodes.CREATED).json({avatar});
};

const updateAvatar = async (req, res) => {
    const {id: avatar_id} = req.params;
    let { name, decks } = req.body;
    let updateObject = req.body;
    const image = req.files.image;
    if (image) {
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
        throw new NotFoundError(`No avatar with ID: ${avatar_id}`);
    }
    res.status(StatusCodes.OK).send({avatar});
};

const deleteAvatar = async (req, res) => {
    const {password} = req.body;
    const avatarId = req.params.id;
    if (!password) {
        throw new BadRequestError(`Please provide a password.`);
    }
    if (!avatarId) {
        throw new BadRequestError(`Please provide an avatar id.`);
    }
    const avatar = await Avatar.findOne({_id: avatarId});
    if (!avatar) {
        throw new NotFoundError(`No avatar with id ${avatarId}`);
    }
    checkPermissions(req.user, avatar.user);
    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials.`);
    }
    await Avatar.findOneAndDelete({_id: avatarId});
    res.status(StatusCodes.OK).json({msg: 'Avatar successfully deleted'});
};

module.exports = {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
};