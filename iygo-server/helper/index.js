const {printWelcomeMessage} = require('./welcome.js');
const {
    saveImageToCloudStorage, 
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('./cloud.js');
const {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser
} = require('./auth.js');

module.exports = {
    saveImageToCloudStorage,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder,
    printWelcomeMessage,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser
}