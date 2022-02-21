const {register} = require('./registerService.js');
const {login} = require('./loginService.js');
const {logout} = require('./logoutService.js');

module.exports = {
    register,
    login,
    logout
}