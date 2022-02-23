const crypto = require('crypto');
const User = require('../../models/User.js');
const {BadRequestError} = require('../../errors');
const {
    sendVerificationEmail,
    createTokenUser,
    attachCookiesToResponse
} = require('../../helper');

const register = async (req, res, callback) => {
    const {
        email,
        name,
        password
    } = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists) {
        return callback(new BadRequestError('Email already exists.'));
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({
        name,
        email,
        role, 
        password,
        verificationToken
    });
    const origin = 'http://localhost:3000'; // front-end
    //const newOrigin ='production url';
    /*
    const origin = req.get('origin');
    const protocol = req.protocol;
    const host = req.get('host');
    const forwardedHost = req.get('x-forwarded-host');
    const forwardedProtocol = req.get('x-forwarded-proto');
    */
    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    });
    /*
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res,
        user: tokenUser
    });
    */
    //return callback(null, {user: tokenUser});

    return callback(null, {
        msg: 'Success! Please check your email to verify your account.',
    });
};

module.exports = {
    register
}