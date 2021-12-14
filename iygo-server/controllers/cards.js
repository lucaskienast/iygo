const Card = require('../models/Card.js');

const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');

const login = async (req, res) => {
    console.log(req.user);
    const {username, password} = req.body;
    if (!username || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    // do not put confidential info in the jwt token
    // eg. passwords
    // normally send back the user id
    // try to keep payload small for better user experience
    //use long & complex & unguessable secret values in .env
    const id = new Date().getDate();
    const token = jwt.sign(
        {id, username}, 
        process.env.JWT_SECRET, 
        {expiresIn: '30d'}
    );
    res.status(200).json({
        msg: 'User created',
        token
    });
};

const getAllCards = async (req, res) => {
    const {
        type,
        race,
        attribute,
        name,
        sort,
        numericFilters,
        fields // which props to display at output
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
    res.status(200).json({nbHits: cards.length, cards});
};

const createCard = async (req, res) => {
    const card = await Card.create(req.body);
    res.status(201).json({card});
};

const getCard = async (req, res, next) => {
    const {id: card_id} = req.params;
    const card = await Card.findOne({card_id});
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({card});
};

const updateCard = async (req, res) => {
    const {id: card_id} = req.params;
    const card = await Card.findOneAndUpdate({
        card_id
    }, req.body, {
        new: true,
        runValidators: true
    });
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({card});
};

const deleteCard = async (req, res) => {
    const {id: card_id} = req.params;
    const card = await Card.findOneAndDelete({card_id});
    if (!card) {
        return next(createCustomError(`No card with ID: ${card_id}`, 404));
    }
    res.status(200).json({msg: 'Card successfully deleted'});
};

module.exports = {
    getAllCards,
    createCard,
    getCard,
    updateCard,
    deleteCard,
    login
};