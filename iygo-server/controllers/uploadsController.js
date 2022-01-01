const fs = require('fs');
const path = require('path');
const {StatusCodes} = require('http-status-codes');
const cloudinary = require('cloudinary').v2;

const uploadProductImage = async (req, res) => {
    console.log("Start");
    const fileNames = fs.readdirSync(path.join(__dirname, '../public/large-images/'));
    console.log("Files ready");
    console.log("Start loop");
    let failedUploads = [];
    let succeededUploads = 0;
    for (let i = 0; i < fileNames.length; i++) {
        console.log("Uploading file #" + i + ": " + fileNames[i]);
        try {
            const result = await cloudinary.uploader.upload(path.join('public', 'large-images', fileNames[i]), {
                use_filename: true,
                folder: "iygo-cards-large"
            });
            succeededUploads += 1;
        } catch (error) {
            failedUploads.push({
                file: fileNames[i],
                error
            });
            console.log(error);
        }   
    }
    console.log("End");
    return res.status(StatusCodes.OK).json({
        msg: "Finished uploading images",
        numSucc: succeededUploads.length,
        numFail: failedUploads.length,
        failedUploads
    });
};

module.exports = {
    uploadProductImage
}