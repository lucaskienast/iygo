const {
    saveImageToCloudStorage, 
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('./cloud.js');

const {printWelcomeMessage} = require('./welcome.js');

module.exports = {
    saveImageToCloudStorage,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder,
    printWelcomeMessage
}