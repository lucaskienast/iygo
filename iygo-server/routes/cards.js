const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    login
} = require('../controllers/cards.js');

router.route('/').get(authMiddleware, getAllCards).post(createCard);
router.route('/login').post(login); // delete later
router.route('/:id').get(getCard).patch(updateCard).delete(deleteCard);

module.exports = router;