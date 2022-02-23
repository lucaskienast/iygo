const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication.js');
const {
    login, 
    register,
    logout,
    verifyEmail
} = require('../controllers/authController.js');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
router.post('/verify-email', verifyEmail);


module.exports = router;