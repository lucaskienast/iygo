const {getAllCards} = require('./getAllCardsService.js');
const {createCard} = require('./createCardService.js');
const {getSingleCard} = require('./getSingleCardService.js');
const {updateCard} = require('./updateCardService.js');
const {deleteCard} = require('./deleteCardService.js');
const {updateCardImages} = require('./updateCardImagesService.js');

module.exports = {
    getAllCards,
    createCard,
    getSingleCard,
    updateCard,
    deleteCard,
    updateCardImages
}