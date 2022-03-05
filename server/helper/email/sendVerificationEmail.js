const {sendEmail} = require('./sendEmail.js');
//origin is url for front-end
const sendVerificationEmail = async ({name, email, verificationToken, origin}) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
    const message = `<p>Please confirm your email by clicking this link : <a href="${verifyEmail}">Verify email</a></p>`;
    return sendEmail({
        to: email, 
        subject: "Phoenix League Verification", 
        html: `<h4>Hello, ${name}</h4>${message}`
    });
};

module.exports = {sendVerificationEmail};