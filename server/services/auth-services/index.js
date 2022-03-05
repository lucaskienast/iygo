const {register} = require('./registerService.js');
const {login} = require('./loginService.js');
const {logout} = require('./logoutService.js');
const {verifyEmail} = require('./verifyEmailService.js');
const {forgotPassword} = require('./forgotPasswordService.js');
const {resetPassword} = require('./resetPasswordService.js');

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
}