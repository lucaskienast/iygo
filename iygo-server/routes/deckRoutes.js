const express = require('express');
const router = express.Router();
const {
    authenticateUser, 
} = require('../middleware/authentication.js');
const {
    getAllDecks,
    getSingleDeck,
    getCurrentUsersDecks,
    createDeck,
    updateDeck,
    deleteDeck
} = require('../controllers/deckController');

router.route('/')
.post(authenticateUser, createDeck)
.get(authenticateUser, getAllDecks);

router.route('/showAllMyDecks')
.get(authenticateUser, getCurrentUsersDecks);

router.route('/:id')
.get(authenticateUser, getSingleDeck)
.patch(authenticateUser, updateDeck)
.delete(authenticateUser, deleteDeck);

module.exports = router;