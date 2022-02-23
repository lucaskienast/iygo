const {register} = require('./registerService.js');
const {login} = require('./loginService.js');
const {logout} = require('./logoutService.js');
const {verifyEmail} = require('./verifyEmailService.js');

module.exports = {
    register,
    login,
    logout,
    verifyEmail
}