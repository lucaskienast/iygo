const {getAllDecks} = require('./getAllDecksService.js');
const {getSingleDeck} = require('./getSingleDeckService.js');
const {getCurrentUsersDecks} = require('./getCurrentUsersDecksService.js');
const {createDeck} = require('./createDeckService.js');
const {updateDeck} = require('./updateDeckService.js');
const {deleteDeck} = require('./deleteDeckService.js');

module.exports = {
    getAllDecks,
    getSingleDeck,
    getCurrentUsersDecks,
    createDeck,
    updateDeck,
    deleteDeck
}