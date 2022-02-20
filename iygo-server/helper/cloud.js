const fs = require('fs');
const path = require('path');
const axios = require('axios');
const gc = require('../config');
const bucket = gc.bucket('iygo');

const deleteCloudImageFromFolder = async (folderName, fileName) => {
    await bucket.file(folderName + '/' + fileName).delete();
}

const getAllCloudImagesFromFolder = async (folderName) => {
    const options = {
        prefix: folderName + '/'
        //delimiter: '/'
    }
    const [images] = await bucket.getFiles(options);
    return images.map(image => image.metadata.name);
};

const saveImageToCloudStorage = async (url, folderName, fileName) => {
    // download file to local
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const localPath = path.join(__dirname, '..', 'images', 'card-images', folderName , fileName + '.jpg');
    await fs.promises.writeFile(localPath, response.data);
    // upload file to cloud
    return new Promise((resolve, reject) => {
        const localReadStream = fs.createReadStream(localPath);
        const remoteWriteStream = bucket.file(path.join(folderName, fileName + ".jpg")).createWriteStream({resumable: false});
        localReadStream.pipe(remoteWriteStream)
        .on('finish', () => {
            fs.unlink(localPath, (err) => console.log(err));
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}.jpg`;
            resolve(publicUrl);
        })
        .on('error', (err) => {
            fs.unlink(localPath, (err) => console.log(err));
            reject(err);
        });
    });
};

const saveImageToCloudStorageFromRequestFile = async (image, folderName, fileName) => {
    const localPath = path.join(__dirname, '..', 'images', folderName, fileName + '.jpg');
    await image.mv(localPath);
    return new Promise((resolve, reject) => {
        const localReadStream = fs.createReadStream(localPath);
        const remoteWriteStream = bucket.file(path.join(folderName, fileName + ".jpg")).createWriteStream({resumable: false});
        localReadStream.pipe(remoteWriteStream)
        .on('finish', () => {
            fs.unlink(localPath, (err) => console.log(err));
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}.jpg`;
            resolve(publicUrl);
        })
        .on('error', (err) => {
            fs.unlink(localPath, (err) => console.log(err));
            reject(err);
        });
    });
};

module.exports = {
    saveImageToCloudStorage,
    saveImageToCloudStorageFromRequestFile,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
};