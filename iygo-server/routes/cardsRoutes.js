const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication.js');
const {uploadProductImage} = require('../controllers/uploadsController.js');
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard
} = require('../controllers/cardsController.js');

router.route('/')
.get(getAllCards)
.post(authMiddleware, createCard);

router.route('/uploads')
.post(authMiddleware, uploadProductImage);

router.route('/:id')
.get(getCard)
.patch(authMiddleware, updateCard)
.delete(authMiddleware, deleteCard);

module.exports = router;