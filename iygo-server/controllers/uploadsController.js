const fs = require('fs');
const path = require('path');
const {StatusCodes} = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const CustomError = require('../errors');

const uploadProductImageLocal = async(req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError("No file uploaded");
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError("Please upload an image");
    }
    const maxSize = 1024 * 1024; // 1 MB
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Please upload an image with size smaller than 1kB");
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    return res.status(StatusCodes.OK).json({
        image: {
            src: `/uploads/${productImage.name}`
        }
    });
};

const uploadProductImage = async (req, res) => {
    console.log("Start");
    const fileNames = fs.readdirSync(path.join(__dirname, '../public/large-images/'));
    console.log("Files ready");
    console.log("Start loop");
    for (let i = 0; i < fileNames.length; i++) {
        console.log("Uploading file #" + i + ": " + fileNames[i]);
        try {
            const result = await cloudinary.uploader.upload(path.join('public', 'large-images', fileNames[i]), {
                use_filename: true,
                folder: "iygo-cards-large"
            });
        } catch (error) {
            console.log(error);
        }   
    }
    console.log("End");
};

module.exports = {
    uploadProductImage
}