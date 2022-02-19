const {StatusCodes} = require('http-status-codes');
const deckServices = require('../services/deck-services');
const {
    BadRequestError, 
    UnauthenticatedError,
    NotFoundError
} = require('../errors');

const getAllDecks = async (req, res) => {
    await deckServices.getAllDecks(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const getSingleDeck = async (req, res) => {
    await deckServices.getSingleDeck(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const getCurrentUsersDecks = async (req, res) => {
    await deckServices.getCurrentUsersDecks(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const createDeck = async (req, res) => {
    await deckServices.createDeck(req, (error, result) => {
        if (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const updateDeck = async (req, res) => {    
    await deckServices.createDeck(req, (error, result) => {
        if (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const deleteDeck = async (req, res) => {
    await deckServices.deleteDeck(req, (error, result) => {
        if (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            }
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.message);
            }
            if (error instanceof UnauthenticatedError) {
                throw new UnauthenticatedError(error.message);
            }
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    getAllDecks,
    getSingleDeck,
    getCurrentUsersDecks,
    createDeck,
    updateDeck,
    deleteDeck
};