const express = require('express');
const router = express.Router();
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    searchCards
} = require('../controllers/cards.js');

router.route('/').get(getAllCards).post(createCard);
router.route('/query').get(searchCards);
router.route('/:id').get(getCard).patch(updateCard).delete(deleteCard);


module.exports = router;