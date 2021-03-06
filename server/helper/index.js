const {printWelcomeMessage} = require('./welcome.js');
const {checkPermissions} = require('./checkPermissions.js');
const {createHash} = require('./createHash.js');
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
    sendVerificationEmail,
    sendResetPasswordEmail
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
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash
}