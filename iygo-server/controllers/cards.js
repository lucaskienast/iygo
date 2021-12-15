const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');
const Card = require('../models/Card.js');

const getAllCards = async (req, res) => {
    const {
        type,
        race,
        attribute,
        name,
        sort,
        numericFilters,
        fields, // which props to display at output
        // user query option for future custom user-made cards
    } = req.query;
    const queryObject = {};
    if (type) {
        queryObject.type = type;
    }
    if (race) {
        queryObject.race = race;
    }
    if (attribute) {
        queryObject.attribute = attribute;
    }
    /*if (user) {
        // queryObject.created_by equals or includes given user
        // user from personal token or input if not self
    }*/
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => {
            return `-${operatorMap[match]}-`;
        });
        const options = ['atk', 'def', 'level', 'scale'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { 
                    [operator]: Number(value) 
                };
            }
        });
    }
    let result = Card.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('created_at');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const cards = await result;
    res.status(StatusCodes.OK).json({nbHits: cards.length, cards});
};

const createCard = async (req, res) => {
    // use later for custom user-made cards
    // req.body.created_by = req.user.userId;
    const card = await Card.create(req.body);
    res.status(StatusCodes.CREATED).json({card});
};

const getCard = async (req, res, next) => {
    const {id: card_id} = req.params;
    const card = await Card.findOne({card_id});
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({card});
};

const updateCard = async (req, res) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndUpdate({
        card_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({card});
};

const deleteCard = async (req, res) => {
    // check in future whether user is card creator
    const {id: card_id} = req.params;
    const card = await Card.findOneAndDelete({card_id});
    if (!card) {
        throw new NotFoundError(`No card with ID: ${card_id}`);
    }
    res.status(StatusCodes.OK).json({msg: 'Card successfully deleted'});
};

module.exports = {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard
};