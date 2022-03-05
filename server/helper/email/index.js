const {sendEmail} = require('./sendEmail.js');
const {sendVerificationEmail} = require('./sendVerificationEmail.js');
const {sendResetPasswordEmail} = require('./sendResetPasswordEmail.js');

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail
}