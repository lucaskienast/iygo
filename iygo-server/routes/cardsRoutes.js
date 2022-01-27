const express = require('express');
const router = express.Router();
const {
    authenticateUser, 
    authorizePermissions
} = require('../middleware/authentication.js');
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    updateCardImages,
    countCardsAndImages
} = require('../controllers/cardsController.js');

router.route('/')
.get(getAllCards)
.post(authenticateUser, createCard);

router.route('/update')
.post(authenticateUser, updateCardImages);

router.route('/count')
.get(authenticateUser, countCardsAndImages);

/*
router.route('/uploads')
.post(authenticateUser, getAllCardsJSON);
*/

router.route('/:id')
.get(getCard)
.patch(authenticateUser, updateCard)
.delete(authenticateUser, deleteCard);

module.exports = router;