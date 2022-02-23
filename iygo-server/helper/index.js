const {printWelcomeMessage} = require('./welcome.js');
const {checkPermissions} = require('./checkPermissions.js');
const {
    saveImageToCloudStorageFromUrl, 
    saveImageToCloudStorageFromRequestFile,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder
} = require('./cloud.js');
const {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser
} = require('./jwt.js');
const {
    sendEmail,
    sendVerificationEmail
} = require('./email');

module.exports = {
    saveImageToCloudStorageFromUrl,
    saveImageToCloudStorageFromRequestFile,
    getAllCloudImagesFromFolder,
    deleteCloudImageFromFolder,
    printWelcomeMessage,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions,
    sendEmail,
    sendVerificationEmail
}