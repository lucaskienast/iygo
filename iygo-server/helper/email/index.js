const {sendEmail} = require('./sendEmail.js');
const {sendVerificationEmail} = require('./sendVerificationEmail.js');

module.exports = {
    sendEmail,
    sendVerificationEmail
}