const axios = require('axios');
const jimp = require("jimp");
const Card = require('../../models/Card.js');
const {
    saveImageToCloudStorageFromUrl,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('../../helper');

const updateCardImages = async (req, callback) => {
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
                    const publicImageUrl = await saveImageToCloudStorageFromUrl(ygoproCardImageDuo[sizeKey].url, ygoproCardImageDuo[sizeKey].folder, ygoproAllCards[i].card_images[j].id);
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
    return callback({mongodbAllCards});
};

module.exports = {
    updateCardImages
}