const express = require('express');
const router = express.Router();
const {
    authenticateUser, 
} = require('../middleware/authentication.js');
const {
    getAllAvatars,
    getSingleAvatar,
    getCurrentUsersAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar
} = require('../controllers/avatarController');

router.route('/')
.post(authenticateUser, createAvatar)
.get(/*authenticateUser,*/ getAllAvatars);

router.route('/showAllMyAvatars')
.get(authenticateUser, getCurrentUsersAvatars);

router.route('/:id')
.get(authenticateUser, getSingleAvatar)
.patch(authenticateUser, updateAvatar)
.delete(authenticateUser, deleteAvatar);

module.exports = router;