const express = require('express');
const router = express.Router();
const {
    authenticateUser, 
    authorizePermissions
} = require('../middleware/authentication.js');
const {
    getAllCards,
    createCard,
    getSingleCard,
    updateCard,
    deleteCard,
    updateCardImages
} = require('../controllers/cardsController.js');

router.route('/')
.get(getAllCards)
.post(authenticateUser, createCard);

router.route('/update')
.post(authenticateUser, updateCardImages);

router.route('/:id')
.get(getSingleCard)
.patch(authenticateUser, updateCard)
.delete(authenticateUser, deleteCard);

module.exports = router;