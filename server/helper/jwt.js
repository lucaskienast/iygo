const jwt = require('jsonwebtoken');

const createJWT = ({payload}) => {
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        /*{expiresIn: process.env.JWT_LIFETIME}*/
    );
    return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({res, user, refreshToken}) => {
    const accessTokenJwt = createJWT({ payload: {user} });
    const refreshTokenJwt = createJWT({ payload: {user, refreshToken} });
    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    // working in http when testing
    // use secure in production
    // if not in production use http
    res.cookie('accessToken', accessTokenJwt, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });

    res.cookie('refreshToken', refreshTokenJwt, {
        httpOnly: true,
        expires: new Date(Date.now() + oneMonth),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
};

const attachSingleCookieToResponse = ({res, user}) => {
    const token = createJWT({payload: user});
    const oneDay = 1000 * 60 * 60 * 24;
    // working in http when testing
    // use secure in production
    // if not in production use http
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
};

const createTokenUser = (user) => {
    return {
        name: user.name,
        userId: user._id,
        role: user.role
    };
};

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser
}