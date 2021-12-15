const CustomAPIError = require('./custom-api.js');
const BadRequestError = require('./bad-request.js');
const UnauthenticatedError = require('./unauthenticated.js');
const NotFoundError = require('./not-found.js');

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError
}