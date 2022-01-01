const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication.js');
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
.post(authMiddleware, createCard);

router.route('/update')
.post(authMiddleware, updateCardImages);

router.route('/count')
.get(authMiddleware, countCardsAndImages);

/*
router.route('/uploads')
.post(authMiddleware, getAllCardsJSON);
*/

router.route('/:id')
.get(getCard)
.patch(authMiddleware, updateCard)
.delete(authMiddleware, deleteCard);

module.exports = router;