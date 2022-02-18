const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');
const cardServices = require('../services/card-services');

const getAllCards = async (req, res) => {
    await cardServices.getAllCards(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const createCard = async (req, res) => {
    await cardServices.createCard(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

const getSingleCard = async (req, res) => {
    await cardServices.getSingleCard(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const updateCard = async (req, res) => {
    await cardServices.updateCard(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const deleteCard = async (req, res) => {
    await cardServices.deleteCard(req, (error, result) => {
        if (error) {
            throw new NotFoundError(error);
        }
        return res.status(StatusCodes.OK).json(result);
    });
};

const updateCardImages = async (req, res) => {
    await cardServices.updateCardImages(req, (result) => {
        return res.status(StatusCodes.OK).json(result);
    });
};

module.exports = {
    getAllCards,
    createCard,
    getSingleCard,
    updateCard,
    deleteCard,
    updateCardImages
};