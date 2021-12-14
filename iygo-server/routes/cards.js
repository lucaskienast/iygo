const express = require('express');
const router = express.Router();
const {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
} = require('../controllers/cards.js');

router.route('/').get(getAllCards).post(createCard);
router.route('/:id').get(getCard).patch(updateCard).delete(deleteCard);


module.exports = router;