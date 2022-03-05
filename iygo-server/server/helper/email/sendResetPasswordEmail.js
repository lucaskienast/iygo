const {sendEmail} = require('./sendEmail.js');
//origin is url for front-end
const sendResetPasswordEmail = async ({name, email, token, origin}) => {
    const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
    const message = `<p>Please reset your password by clicking this link : <a href="${resetUrl}">Reset password</a></p>`;
    return sendEmail({
        to: email, 
        subject: "Phoenix League Reset Password", 
        html: `<h4>Hello, ${name}</h4>${message}`
    });
};

module.exports = {sendResetPasswordEmail};