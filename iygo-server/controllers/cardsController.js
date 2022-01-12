const axios = require('axios');
const jimp = require("jimp");
const {StatusCodes} = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const {NotFoundError} = require('../errors');
const Card = require('../models/Card.js');
const {
    saveImageToCloudStorage,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('../helper');

const getAllCards = async (req, res) => {
    const {
        type,
        race,
        attribute,
        name,
        sort,
        numericFilters,
        fields, // which props to display at output
        // user query option for future custom user-made cards
    } = req.query;
    const queryObject = {};
    if (type) {
        queryObject.type = type;
    }
    if (race) {
        queryObject.race = race;
    }
    if (attribute) {
        queryObject.attribute = attribute;
    }
    /*if (user) {
        // queryObject.created_by equals or includes given user
        // user from personal token or input if not self
    }*/
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => {
            return `-${operatorMap[match]}-`;
        });
        const options = ['atk', 'def', 'level', 'scale'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { 
                    [operator]: Number(value) 
                };
            }
        });
    }
    let result = Card.find(queryObject);
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
    const cards = await result;
    res.status(StatusCodes.OK).json({nbHits: cards.length, cards});
};

const createCard = async (req, res) => {
    // use later for custom user-made cards
    // req.body.created_by = req.user.userId;
    const card = await Card.create(req.body);
    res.status(StatusCodes.CREATED).json({card});
};

const getCard = async (req, res, next) => {
    const {id: card_id} = req.params;
    const card = await Card.findOne({card_id});
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({card});
};

const updateCard = async (req, res) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndUpdate({
        card_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({card});
};

const deleteCard = async (req, res) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndDelete({card_id});
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({msg: 'Card successfully deleted'});
};

const countCardsAndImages = async (req, res) => {
    console.log("1");
    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    console.log("Downloading JSON from YGOPRODECK");
    const result = await axios.get(url);
    const allCardsYgoPro = result.data.data;
    console.log(allCardsYgoPro[0]);
    let imgCounter = 0;
    let cardCounter = allCardsYgoPro.length;
    console.log("2");
    for (let i = 0; i < /*allCardsYgoPro.length*/10; i++) {
        console.log("3");
        const cardYgoPro = allCardsYgoPro[i];
        imgCounter += cardYgoPro.card_images.length;
        for (let j = 0; j < /*allCardsYgoPro[i].card_images.length*/1; j++) {
            console.log("4");
            const imageUrl = await saveImageToCloudStorage(allCardsYgoPro[i].card_images[j].image_url, "large-card-images", allCardsYgoPro[i].card_images[j].id);
            console.log(imageUrl);
        }
    }
    res.status(StatusCodes.OK).json({imgCounter, cardCounter});
};

const updateCardImages = async (req, res) => {
    // get cards from YGOPRODECK
    console.log("Downloading JSON from YGOPRODECK");
    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    const result = await axios.get(url);
    const ygoproAllCards = result.data.data; 
    console.log("Number of cards on YGOPRO: " + ygoproAllCards.length);
    // get cards from MongoDB
    console.log("Downloading cards from MongoDB");
    let mongodbAllCards = await Card.find();
    console.log("Number of cards on MongoDB: " + mongodbAllCards.length);
    // get large and small card images from cloud
    console.log("Downloading card images from Google Cloud");
    const cloudLargeImages = await getAllCloudImagesFromFolder('large-card-images');
    console.log("Number of large images on Cloud: " + cloudLargeImages.length);
    const cloudSmallImages = await getAllCloudImagesFromFolder('small-card-images');
    console.log("Number of small images on Cloud: " + cloudSmallImages.length);
    // loop through YGOPRODECK cards and update MongoDb + Google Cloud
    for (let i = 0; i < ygoproAllCards.length; i++) {
        console.log("\n#Cards:" + i);
        console.log("Current card ID: " + ygoproAllCards[i].id);
        for (let j = 0; j < ygoproAllCards[i].card_images.length; j++) {
            console.log("Current image ID: " + ygoproAllCards[i].card_images[j].id);
            const ygoproCardImageDuo = {
                large_image: {
                    url: ygoproAllCards[i].card_images[j].image_url,
                    folder: "large-card-images",
                    urlProp: "image_url"
                },
                small_image: {
                    url: ygoproAllCards[i].card_images[j].image_url_small,
                    folder: "small-card-images",
                    urlProp: "image_url_small"
                }
            };
            for (sizeKey in ygoproCardImageDuo) {
                const cloudImagesToCheck = (sizeKey === 'large_image') ? cloudLargeImages : cloudSmallImages;
                const existingCloudImages = cloudImagesToCheck.filter((cloudImage) => {
                    const cloudImageId = cloudImage.split("/")[1].split(".jpg")[0];
                    return (Number(cloudImageId) === Number(ygoproAllCards[i].card_images[j].id));
                });
                console.log(existingCloudImages);
                let dbImageUrlToCheck = "";
                if (!existingCloudImages[0]) {
                    // no image with same id in cloud
                    // upload new image to cloud
                    console.log("Uploading new image to cloud");
                    const publicImageUrl = await saveImageToCloudStorage(ygoproCardImageDuo[sizeKey].url, ygoproCardImageDuo[sizeKey].folder, ygoproAllCards[i].card_images[j].id);
                    dbImageUrlToCheck = publicImageUrl;
                } else {
                    // found image with same id in cloud
                    console.log("One or more cards found with same id in cloud.");
                    if (existingCloudImages.length >= 2) {
                        // found multiple images with same id in cloud
                        // delete all except one
                        console.log("Found multiple cards for same card id in cloud.");
                        for (let k = 0; k < existingCloudImages.length; k++) {
                            await deleteCloudImageFromFolder(existingCloudImages[k].split("/")[0], existingCloudImages[k].split("/")[1]);
                        }
                    }
                    console.log("Comparing images via Jimp...");
                    const cloudUrl = `https://storage.googleapis.com/iygo/${existingCloudImages[0].split("/")[0]}/${existingCloudImages[0].split("/")[1]}`;
                    const oldImg = await jimp.read(cloudUrl);
                    const newImg = await jimp.read(ygoproCardImageDuo[sizeKey].url);
                    const distance = jimp.distance(oldImg, newImg);
                    const difference = jimp.diff(oldImg, newImg);
                    if (distance < 0.15 || difference < 0.15) {
                        console.log("Images identical...no need for action");
                        dbImageUrlToCheck = cloudUrl;
                    } else {
                        console.log("Images different...replace old with new");
                        await deleteCloudImageFromFolder(existingCloudImages[0].split("/")[0], existingCloudImages[0].split("/")[1]);
                        const publicImageUrl = await saveImageToCloudStorage(ygoproCardImageDuo[sizeKey].url, ygoproCardImageDuo[sizeKey].folder, ygoproAllCards[i].card_images[j].id);
                        dbImageUrlToCheck = publicImageUrl;
                    }         
                }
                console.log('DB image url to check: '+ dbImageUrlToCheck);
                let cardIndexMongoDb = mongodbAllCards.findIndex((card) => card.card_id === ygoproAllCards[i].id);
                if (cardIndexMongoDb === -1) {
                    // card not in MongoDB
                    // create new card in DB and refresh cardIndex for image
                    console.log("Card ID: " + ygoproAllCards[i].id + "(" + ygoproAllCards[i].name + ")" + " does NOT EXIST in MongoDB");
                    console.log("Adding to MongoDB json now...");
                    const {id, ...otherProps} = ygoproAllCards[i];
                    const new_card = {card_id: id, ...otherProps};
                    const newCard = await Card.create(new_card);
                    mongodbAllCards.push(newCard);
                    cardIndexMongoDb = mongodbAllCards.findIndex((card) => card.card_id === ygoproAllCards[i].id);
                }
                const imageIndexMongoDb = mongodbAllCards[cardIndexMongoDb].card_images.findIndex((image) => image.id === ygoproAllCards[i].card_images[j].id);
                if (imageIndexMongoDb === -1) {
                    // image not in MongoDB card object
                    // update card object with new image
                    console.log("Image ID: " + ygoproAllCards[i].id + "(" + ygoproAllCards[i].name + ")" + " does NOT EXIST in MongoDB");
                    console.log("Pushing new image object to card in MongoDB");
                    mongodbAllCards[cardIndexMongoDb].card_images.push({
                        id: ygoproAllCards[i].id,
                        image_url: (sizeKey === "large_image" ? dbImageUrlToCheck : ""),
                        image_url_small: (sizeKey === "small_image" ? dbImageUrlToCheck : "")
                    });
                    await Card.findOneAndUpdate({
                        card_id: ygoproAllCards[i].id
                    }, mongodbAllCards[cardIndexMongoDb], {
                        new: true,
                        runValidators: true
                    });
                }
                else if (mongodbAllCards[cardIndexMongoDb].card_images[imageIndexMongoDb][ygoproCardImageDuo[sizeKey].urlProp] !== dbImageUrlToCheck) {
                    // image with id found for card in MongoDB
                    // but urls are different
                    // update url to new one from YGOPRODECK
                    console.log("Image ID: " + ygoproAllCards[i].id + "(" + ygoproAllCards[i].name + ")" + " does EXIST in MongoDB");
                    console.log("BUT urls are different...updating url in MongoDB");
                    mongodbAllCards[cardIndexMongoDb].card_images[imageIndexMongoDb][ygoproCardImageDuo[sizeKey].urlProp] = dbImageUrlToCheck;
                    await Card.findOneAndUpdate({
                        card_id: ygoproAllCards[i].id
                    }, mongodbAllCards[cardIndexMongoDb], {
                        new: true,
                        runValidators: true
                    });
                }
                else {
                    // card found in MongoDB
                    // images of YGOPRODECK and MongoDB same
                    // no action needed
                    console.log("Image ID: " + ygoproAllCards[i].id + "(" + ygoproAllCards[i].name + ")" + " does EXIST in MongoDB");
                    console.log("AND urls are same...NOT updating url in MongoDB");
                }
            }
        }
    }
    console.log("Done");
    res.status(StatusCodes.OK).json(mongodbAllCards);
};

const updateCardImages2 = async (req, res) => {
    let newCloudImages = [];
    let deletedCloudImages = [];
    let newDbImages = [];
    let replacingDbImages = [];
    let completelyNewCardsNotInDb = [];
    console.log("Downloading JSON from YGOPRODECK");
    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    const result = await axios.get(url);
    const allCardsYgoPro = result.data.data; 
    console.log("Downloading cards from MongoDB");
    let allCardsMongoDb = await Card.find();
    console.log("Downloading cards from Cloudinary");
    let existingCloudImages = [];
    const getExistingCloudImages = async (chunk_count, next_cursor, done = false) => {
        next_cursor = next_cursor ? next_cursor : null; 
        return new Promise((resolve, reject) => {
            cloudinary.api.resources({
                resource_type:"image",
                type: "upload",
                max_results: 20000, //limited to 500 automatically
                next_cursor: next_cursor
            }).then((res) => {
                res.resources.forEach((resource) => {
                    existingCloudImages.push(resource);
                });
                if (res.next_cursor) {
                    next_cursor = res.next_cursor;
                } else {
                    done = true;
                }
                resolve();
            }).catch((error) => {
                console.log(error);
                reject();
            });
        }).then(async () => {
            if (done === false) {
                await getExistingCloudImages(chunk_count, next_cursor, done);
            } else {
                return;
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    await getExistingCloudImages();
    console.log("No. images in cloud: " + existingCloudImages.length);
    for (let i = 0; i < allCardsYgoPro.length; i++) {
        const cardYgoPro = allCardsYgoPro[i];
        console.log("No. cards looped: " + i);
        console.log("Current card ID: " + cardYgoPro.id);
        for (let j = 0; j < cardYgoPro.card_images.length; j++) {
            const cardImageYgoPro = cardYgoPro.card_images[j];
            console.log("Current image ID: " + cardImageYgoPro.id);
            const cloudUploadImages = {
                large_image: {
                    url: cardImageYgoPro.image_url,
                    folder: "large-card-images",
                    urlProp: "image_url"
                },
                small_image: {
                    url: cardImageYgoPro.image_url_small,
                    folder: "small-card-images",
                    urlProp: "image_url_small"
                }
            };
            for (const cloudImageKey in cloudUploadImages) {
                const existingCloudImage = existingCloudImages.filter((cloudImage) => {
                    const cloudImageFolder = cloudImage.public_id.split("/")[0];
                    const cloudImageId = cloudImage.public_id.split("/")[1].split("_")[0];
                    return (Number(cloudImageId) === Number(cardImageYgoPro.id) && (cloudImageFolder === cloudUploadImages[cloudImageKey].folder));
                });
                let cloudImageUrlToCheckInDB = "";
                if (!existingCloudImage[0]) {
                    console.log("Uploading new image to cloud");
                    const result = await cloudinary.uploader.upload(cloudUploadImages[cloudImageKey].url, {
                        use_filename: true,
                        folder: cloudUploadImages[cloudImageKey].folder
                    });
                    cloudImageUrlToCheckInDB = result.url;
                    newCloudImages.push(cloudImageUrlToCheckInDB);
                }
                else {
                    console.log("One or more cards found with same id in cloud.");
                    if (existingCloudImage.length >= 2) {
                        console.log("Found multiple cards for same card id in cloud.");
                        for (let k = 1; k < existingCloudImage.length; k++) {
                            deletedCloudImages.push(existingCloudImage[k].public_id);
                            await cloudinary.uploader.destroy(existingCloudImage[k].public_id, {
                                type: "upload",
                                resource_type: "image"
                            });
                        }
                    }
                    cloudImageUrlToCheckInDB = existingCloudImage[0].url;
                    console.log("Comparing images via Jimp...");
                    const oldImg = await jimp.read(existingCloudImage[0].url);
                    const newImg = await jimp.read(cloudUploadImages[cloudImageKey].url);
                    const distance = jimp.distance(oldImg, newImg);
                    const difference = jimp.diff(oldImg, newImg);
                    if (distance < 0.15 || difference || 0.15) {
                        console.log("Images identical...no need for action");
                        cloudImageUrlToCheckInDB = existingCloudImage[0].url;
                    } else {
                        console.log("Images different...replace old with new");
                        deletedCloudImages.push(existingCloudImage[0].public_id);
                        await cloudinary.uploader.destroy(existingCloudImage[0].public_id, {
                            type: "upload",
                            resource_type: "image"
                        });
                        const result = await cloudinary.uploader.upload(cloudUploadImages[cloudImageKey].url, {
                            use_filename: true,
                            folder: cloudUploadImages[cloudImageKey].folder
                        });
                        cloudImageUrlToCheckInDB = result.url;
                        newCloudImages.push(cloudImageUrlToCheckInDB);
                    }         
                }
                console.log("Editing image address in MongoDB Json");
                let cardIndexMongoDb = allCardsMongoDb.findIndex((card) => card.card_id === cardYgoPro.id);
                if (cardIndexMongoDb === -1) {
                    console.log("Card ID: " + cardYgoPro.id + "(" + cardYgoPro.name + ")" + " does NOT EXIST in MongoDB");
                    console.log("Adding to MongoDB json now...");
                    completelyNewCardsNotInDb.push(cardYgoPro.id);
                    const {id, ...otherProps} = cardYgoPro;
                    const new_card = {card_id: id, ...otherProps};
                    const newCard = await Card.create(new_card);
                    allCardsMongoDb.push(newCard);
                    cardIndexMongoDb = allCardsMongoDb.findIndex((card) => card.card_id === new_card.card_id);
                }
                const imageIndexMongoDb = allCardsMongoDb[cardIndexMongoDb].card_images.findIndex((image) => image.id === cardImageYgoPro.id);
                if (imageIndexMongoDb === -1) {
                    console.log("Image ID: " + cardImageYgoPro.id + "(" + cardYgoPro.name + ")" + " does NOT EXIST in MongoDB");
                    console.log("Pushing new image object to card in MongoDB");
                    allCardsMongoDb[cardIndexMongoDb].card_images.push({
                        id: cardImageYgoPro.id,
                        image_url: (cloudImageKey === "large-image" ? cloudImageUrlToCheckInDB : ""),
                        image_url_small: (cloudImageKey === "small-image" ? cloudImageUrlToCheckInDB : "")
                    });
                    newDbImages.push(cloudImageUrlToCheckInDB);
                    await Card.findOneAndUpdate({
                        card_id: cardYgoPro.id
                    }, allCardsMongoDb[cardIndexMongoDb], {
                        new: true,
                        runValidators: true
                    });
                }
                else if (allCardsMongoDb[cardIndexMongoDb].card_images[imageIndexMongoDb][cloudUploadImages[cloudImageKey].urlProp] !== cloudImageUrlToCheckInDB) {
                    console.log("Image ID: " + cardImageYgoPro.id + "(" + cardYgoPro.name + ")" + " does EXIST in MongoDB");
                    console.log("BUT urls are different...updating url in MongoDB");
                    allCardsMongoDb[cardIndexMongoDb].card_images[imageIndexMongoDb][cloudUploadImages[cloudImageKey].urlProp] = cloudImageUrlToCheckInDB;
                    replacingDbImages.push(cloudImageUrlToCheckInDB);
                    await Card.findOneAndUpdate({
                        card_id: cardYgoPro.id
                    }, allCardsMongoDb[cardIndexMongoDb], {
                        new: true,
                        runValidators: true
                    });
                }
                else {
                    console.log("Image ID: " + cardImageYgoPro.id + "(" + cardYgoPro.name + ")" + " does EXIST in MongoDB");
                    console.log("AND urls are same...NOT updating url in MongoDB");
                }
            }
        }
    }
    console.log("newCloudImages: " + newCloudImages.length);
    console.log("deletedCloudImages: " + deletedCloudImages.length);
    console.log("newDbImages: " + newDbImages.length);
    console.log("replacingDbImages: " + replacingDbImages.length);
    console.log("completelyNewCardsNotInDb: " + completelyNewCardsNotInDb.length);
    res.status(StatusCodes.OK).json(allCardsMongoDb);
};

module.exports = {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    updateCardImages,
    countCardsAndImages
};