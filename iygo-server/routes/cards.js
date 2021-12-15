const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authentication.js");
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard
} = require('../controllers/cards.js');

router.route('/')
.get(getAllCards)
.post(authMiddleware, createCard);

router.route('/:id')
.get(getCard)
.patch(authMiddleware, updateCard)
.delete(authMiddleware, deleteCard);

module.exports = router;